import { GET_PRESIGNED_DOWNLOAD_URLS_QUERY } from './../graphql/queries/getPresignedDownloadUrls'
import { useDeploymentStore } from './deployment'
import { REJECT_MODERATION_POST_VERSION_MUTATION } from './../graphql/mutations/rejectModerationPostVersion'
import { APPROVE_MODERATION_POST_VERSION_MUTATION } from './../graphql/mutations/approveModerationPostVersion'
import { GET_CATEGORIES_QUERY } from './../graphql/queries/getCategories'
import { useUserStore } from './user'
import { CREATE_MODERATION_POST_MUTATION } from './../graphql/mutations/createModerationPost'
import { apolloClient } from './../graphql/client/index'
import { GET_MODERATION_POSTS_QUERY } from './../graphql/queries/getModerationPosts'
import { defineStore } from 'pinia'
import { provideApolloClient } from '@vue/apollo-composable'

import authService from '@/services/auth-service'
import type { ApolloError } from '@apollo/client/errors'
import { GET_MODERATION_POST_BY_ID_QUERY } from '@/graphql/queries/getModerationPost'
import { MODIFY_MODERATION_POST_MUTATION } from '@/graphql/mutations/modifyModerationPost'
import { RENEW_POST_MODERATION_MUTATION } from '@/graphql/mutations/renewPostModeration'
import { postFilesBucket, postFilesPresignedUrlTTL } from '@/constants/post'
import { version } from 'graphql'

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
  requiredModerations: number
  status: PostStatus
  versions: PostVersionWithCategoryIds[]
}

export interface Moderation {
  id: number
  decision: 'ACCEPTED' | 'REJECTED'
  moderatorHash: string
  reason: string
  timestamp: string
}

export interface ModerationPost extends Omit<ModerationPostModel, 'versions'> {
  versions: PostVersion[]
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

export interface ModerationPostsState {
  posts: ModerationPost[]
  postInModeration: ModerationPost | undefined
  versionInModeration: PostVersion | undefined
  modifiedPostVersion: PostVersion | undefined
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

const POSTS_LIMIT = 50

export const useModerationPostsStore = defineStore('moderation-posts', {
  state: (): ModerationPostsState => ({
    posts: [],
    postInModeration: undefined,
    versionInModeration: undefined,
    modifiedPostVersion: undefined,
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
    async fetchPosts(loadMore = false) {
      try {
        // Fetch posts from Moderation DB
        this.loading = true

        const { data } = await apolloClient.query({
          query: GET_MODERATION_POSTS_QUERY,
          variables: this.pageInfo && loadMore ? { cursor: this.pageInfo.endCursor } : {}
        })

        // If we're loading more posts, append them. Otherwise, replace the posts.
        const newPosts = data.moderationPosts.edges.map(
          (edge: Edge<ModerationPostModel>) => edge.node
        )
        this.posts = loadMore ? [...this.posts, ...newPosts] : newPosts

        this.totalCount = data.moderationPosts.totalCount
        this.pageInfo = data.moderationPosts.pageInfo

        // Fetch category names from Main DB
        const categoryIds = Array.from(
          this.posts.reduce((acc, post: ModerationPost) => {
            post.versions
              .flatMap((version) => version.categoryIds)
              .forEach((id) => {
                acc.add(id)
              })
            return acc
          }, new Set())
        )

        const { data: categoriesData } = await apolloClient.query({
          query: GET_CATEGORIES_QUERY,
          variables: { filter: { ids: categoryIds } }
        })

        const categories = categoriesData.categories.edges.map(
          (edge: Edge<Category>) => edge.node
        ) as Category[]

        const categoriesMap = categories.reduce((acc, category) => {
          acc.set(category.id, category)
          return acc
        }, new Map<number, Category>())

        this.categories = categoriesMap

        // Replace category Ids in each post with categories
        this.posts = this.posts.map((post) => {
          const versionsWithCategoriesIncluded = post.versions.map((version) => {
            const categoryObjs: Category[] = []

            version.categoryIds.forEach((categoryId: number) => {
              const category = categoriesMap.get(categoryId)
              if (category) {
                categoryObjs.push(category)
              }
            })

            return { ...version, categories: categoryObjs }
          })
          return { ...post, versions: versionsWithCategoriesIncluded }
        })

        if (this.pageInfo?.hasNextPage && this.posts.length <= POSTS_LIMIT) {
          await this.loadMorePosts()
        }
      } catch (error) {
        this.error = error as ApolloError
        this.errorMessage = 'Failed to load posts. Please try again.'
      } finally {
        this.loading = false
      }
    },
    async loadMorePosts() {
      await this.fetchPosts(true)
    },
    async fetchPostById(id: number) {
      try {
        const { data } = await apolloClient.query({
          query: GET_MODERATION_POST_BY_ID_QUERY,
          variables: { moderationPostId: id }
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

      const versionModerators = Array.from(
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
      reason: string
    ): Promise<PostVersionWithCategoryIds | null> {
      if (!this.postInModeration) return null

      try {
        const { data } = await apolloClient.mutate({
          mutation: APPROVE_MODERATION_POST_VERSION_MUTATION,
          variables: { id, moderatorHash, reason }
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
      reason: string
    ): Promise<PostVersionWithCategoryIds | null> {
      if (!this.postInModeration) return null

      try {
        const { data } = await apolloClient.mutate({
          mutation: REJECT_MODERATION_POST_VERSION_MUTATION,
          variables: { id, moderatorHash, reason }
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
      reason: string,
      modifiedData: PostFields
    ) {
      if (!this.postInModeration) return null

      console.log({ modifiedData })

      try {
        const { data } = await apolloClient.mutate({
          mutation: MODIFY_MODERATION_POST_MUTATION,
          variables: { postId, moderatorHash, reason, data: modifiedData }
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
          variables: { postModerationId: selfModeration.id }
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
