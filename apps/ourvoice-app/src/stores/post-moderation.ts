import { GET_PRESIGNED_DOWNLOAD_URLS_QUERY } from './../graphql/queries/getPresignedDownloadUrls'
import { useDeploymentStore } from './deployment'
import { REJECT_MODERATION_POST_VERSION_MUTATION } from './../graphql/mutations/rejectModerationPostVersion'
import { APPROVE_MODERATION_POST_VERSION_MUTATION } from './../graphql/mutations/approveModerationPostVersion'
import { GET_CATEGORIES_QUERY } from './../graphql/queries/getCategories'
import { useUserStore } from './user'
import { CREATE_MODERATION_POST_MUTATION } from './../graphql/mutations/createModerationPost'
import { apolloClient } from './../graphql/client/index'
import { defineStore } from 'pinia'
import { provideApolloClient } from '@vue/apollo-composable'

import authService from '@/services/auth-service'
import { GET_MODERATION_POST_BY_ID_QUERY } from '@/graphql/queries/getModerationPost'
import { MODIFY_MODERATION_POST_MUTATION } from '@/graphql/mutations/modifyModerationPost'
import { RENEW_POST_MODERATION_MUTATION } from '@/graphql/mutations/renewPostModeration'

type PostStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

interface PostVersionWithCategoryIds {
  id: number
  title: string
  content: string
  categoryIds: number[]
  files: string[]
  version: number
  timestamp: string
  status: PostStatus
  authorHash: string
  authorNickname: string
  reason: string
  latest: boolean
  moderations: Moderation[]
  attachmentsDownloadUrls?: { key: string; url: string }[]
}

export interface PostVersion extends Omit<PostVersionWithCategoryIds, 'categories'> {
  categories: Category[]
}
export interface ModerationPostModel {
  id: number
  authorHash: string
  authorNickname: string
  requiredModerations: number
  status: PostStatus
  versions: PostVersionWithCategoryIds[]
}
export interface ModerationPost extends Omit<ModerationPostModel, 'versions'> {
  versions: PostVersion[]
}
export interface Moderation {
  id: number
  decision: 'ACCEPTED' | 'REJECTED'
  moderatorHash: string
  moderatorNickname: string
  reason: string
  timestamp: string
}

export interface Category {
  id: number
  name: string
}

export interface pageInfo {
  endCursor: string
  hasNextPage: boolean
  startCursor: string
}

export interface PostModerationState {
  postInModeration: ModerationPost | undefined
  versionInModeration: PostVersion | undefined
  versionInModification: {
    version: Partial<PostVersionWithCategoryIds> | undefined
    isValid: boolean
  }
  categories: Map<number, Category>
  totalCount: number
  pageInfo: pageInfo | undefined
  loading: boolean
  error: Error | undefined
  errorMessage: string | undefined
  userHasModeratedPost: boolean
}

interface Edge<T> {
  cursor: string
  node: T
}

interface PostFields {
  title?: string
  content?: string
  categoryIds?: number[]
  files?: string[] | null
}

const findSelfModeration = async (
  version: PostVersionWithCategoryIds,
  userId: string,
  deployment: string
) => {
  const promises = version.moderations.map((moderation) => {
    return authService.verifyHash(userId, deployment, moderation.moderatorHash)
  })
  const moderators = await Promise.all(promises)
  return version.moderations[moderators.indexOf(true)]
}

provideApolloClient(apolloClient)

export const usePostModerationStore = defineStore('post-moderation', {
  state: (): PostModerationState => ({
    postInModeration: undefined,
    versionInModeration: undefined,
    versionInModification: {
      version: undefined,
      isValid: false
    },
    categories: new Map(),
    totalCount: 0,
    pageInfo: undefined,
    loading: false,
    error: undefined,
    errorMessage: undefined,
    userHasModeratedPost: false
  }),
  getters: {
    latestPostVersion: (state) =>
      state.versionInModeration?.id === state.postInModeration?.versions[0].id,
    selfModerationForVersion: async (state) => {
      if (!state.versionInModeration) return undefined

      return await findSelfModeration(
        state.versionInModeration,
        useUserStore().userId,
        useDeploymentStore().deployment
      )
    }
  },
  actions: {
    resetVersionInModification() {
      this.versionInModification = {
        version: undefined,
        isValid: false
      }
    },
    async fetchPostById(id: number) {
      try {
        const { data } = await apolloClient.query({
          query: GET_MODERATION_POST_BY_ID_QUERY,
          variables: { moderationPostId: id },
          fetchPolicy: 'no-cache'
        })

        const moderationPost = data.moderationPost as ModerationPostModel

        // Fetch category names from Main DB
        const categoryIds = new Set<number>()
        moderationPost.versions
          .flatMap((version: PostVersionWithCategoryIds) => version.categoryIds)
          .forEach((id: number) => {
            categoryIds.add(id)
          })

        const { data: categoriesData } = await apolloClient.query({
          query: GET_CATEGORIES_QUERY,
          variables: { filter: { ids: Array.from(categoryIds) } }
        })

        const categories = categoriesData.categories.edges.map(
          (edge: Edge<Category>) => edge.node
        ) as Category[]

        const categoriesMap = categories.reduce((acc, category) => {
          acc.set(category.id, category)
          return acc
        }, new Map<number, Category>())

        // Replace category Ids in each post with categories
        const versionsWithCategoriesIncluded = moderationPost.versions.map((version) => {
          const categoryObjs: Category[] = []

          version.categoryIds.forEach((categoryId: number) => {
            const category = categoriesMap.get(categoryId)
            if (category) {
              categoryObjs.push(category)
            }

            return { ...version, categories: categoryObjs }
          })

          return { ...version, categories: categoryObjs }
        })

        const post = { ...moderationPost, versions: versionsWithCategoriesIncluded }

        // Set states to be used for moderation
        this.postInModeration = post
        this.versionInModeration = post.versions[0]
      } catch (error) {
        console.error(`Failed to load post with ID ${id}. Please try again.`, error)
      }
    },
    async getPresignedDownloadUrls(bucket: string, keys: string[], expiresIn: number) {
      try {
        const downloadUrls = await apolloClient.query({
          query: GET_PRESIGNED_DOWNLOAD_URLS_QUERY,
          variables: {
            bucket,
            keys,
            expiresIn
          }
        })

        if (this.versionInModeration) {
          this.versionInModeration.attachmentsDownloadUrls =
            downloadUrls.data.getPresignedDownloadUrls
        }
      } catch (error) {
        console.error(error)
      }
    },

    async createPost({
      title,
      content,
      categoryIds,
      files
    }: {
      title: string
      content: string
      categoryIds: number[]
      files: string[]
    }) {
      // Check for valid deployment and user session
      const deploymentStore = useDeploymentStore()
      const userStore = useUserStore()

      // Check if we can access the session and generate a user hash for storing in the db
      if (!(await userStore.isLoggedIn)) {
        // TODO: Set up a proper error handling module
        throw new Error('User session is invalid')
      }

      const authorHash = await authService.hashInput(userStore.userId, deploymentStore.deployment)
      const requiredModerations = 1

      try {
        await apolloClient.mutate({
          mutation: CREATE_MODERATION_POST_MUTATION,
          variables: {
            data: {
              title,
              content,
              categoryIds,
              files,
              authorHash,
              requiredModerations
            }
          }
        })
      } catch (error) {
        console.error(error)
      }
    },

    // Moderation actions
    async checkIfUserHasModerated(userId: string) {
      const version = this.versionInModeration

      if (!version) return

      const versionModerators: string[] = Array.from(
        version.moderations.reduce((acc, moderation) => {
          if (moderation) acc.add(moderation.moderatorHash)
          return acc
        }, new Set<string>())
      )

      const promises = versionModerators.map((moderator) =>
        authService.verifyHash(userId, useDeploymentStore().deployment, moderator)
      )

      const hasModeratedList = await Promise.all(promises)
      this.userHasModeratedPost = hasModeratedList.includes(true)
    },
    async approvePostVersion(
      id: number,
      moderatorHash: string,
      moderatorNickname: string,
      reason: string
    ): Promise<PostVersionWithCategoryIds | null> {
      if (!this.postInModeration) return null

      try {
        const { data } = await apolloClient.mutate({
          mutation: APPROVE_MODERATION_POST_VERSION_MUTATION,
          variables: { id, moderatorHash, moderatorNickname, reason },
          fetchPolicy: 'no-cache'
        })

        console.log('Post version has been approved', data)

        await this.fetchPostById(this.postInModeration.id)
        this.userHasModeratedPost = true

        return data
      } catch (error) {
        console.error(error)
      }
      return null
    },

    async rejectPostVersion(
      id: number,
      moderatorHash: string,
      moderatorNickname: string,
      reason: string
    ): Promise<PostVersionWithCategoryIds | null> {
      if (!this.postInModeration) return null

      try {
        const { data } = await apolloClient.mutate({
          mutation: REJECT_MODERATION_POST_VERSION_MUTATION,
          variables: { id, moderatorHash, moderatorNickname, reason },
          fetchPolicy: 'no-cache'
        })

        console.log('Post version has been rejected', data)

        await this.fetchPostById(this.postInModeration.id)
        this.userHasModeratedPost = true

        return data
      } catch (error) {
        console.error(error)
      }
      return null
    },

    async modifyModerationPost(
      postId: number,
      moderatorHash: string,
      moderatorNickname: string,
      reason: string,
      modifiedData: PostFields
    ) {
      if (!this.postInModeration) return null

      try {
        const { data } = await apolloClient.mutate({
          mutation: MODIFY_MODERATION_POST_MUTATION,
          variables: { postId, moderatorHash, moderatorNickname, reason, data: modifiedData }
        })
        console.log('Moderation post has been modified', data)

        await this.fetchPostById(this.postInModeration.id)
        return data
      } catch (error) {
        console.error(error)
      }
      return null
    },

    async renewPostModeration() {
      if (!this.postInModeration) {
        console.error('No post in moderation')
        return
      }

      const selfModeration = await this.selfModerationForVersion
      if (!selfModeration) {
        console.error('No self moderation found for post version')
        return
      }

      try {
        const { data } = await apolloClient.mutate({
          mutation: RENEW_POST_MODERATION_MUTATION,
          variables: {
            postModerationId: selfModeration.id,
            moderatorHash: useUserStore().sessionHash
          }
        })
        console.log(
          'Self moderation has been renewed. You can now moderate this version again.',
          data
        )

        await this.fetchPostById(this.postInModeration.id)
        this.userHasModeratedPost = false

        return data
      } catch (error) {
        console.error(error)
      }
    }
  }
})
