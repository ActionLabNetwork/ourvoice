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
  categories: Map<number, Category>
  totalCount: number
  pageInfo: pageInfo | undefined
  loading: boolean
  error: Error | undefined
  errorMessage: string | undefined
}

interface Edge<T> {
  cursor: string
  node: T
}

provideApolloClient(apolloClient)

export const useModerationPostsStore = defineStore('moderation-posts', {
  state: (): ModerationPostsState => ({
    posts: [],
    categories: new Map(),
    totalCount: 0,
    pageInfo: undefined,
    loading: false,
    error: undefined,
    errorMessage: undefined
  }),

  actions: {
    async fetchPosts() {
      try {
        // Fetch posts from Moderation DB
        this.loading = true
        const { data } = await apolloClient.query({
          query: GET_MODERATION_POSTS_QUERY
        })
        this.posts = data.moderationPosts.edges.map((edge: Edge<ModerationPostModel>) => edge.node)
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
      } catch (error) {
        this.error = error as ApolloError
        this.errorMessage = 'Failed to load posts. Please try again.'
      } finally {
        this.loading = false
      }
    },
    async fetchPostById(id: number): Promise<ModerationPost | null> {
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

        const retVal = { ...moderationPost, versions: versionsWithCategoriesIncluded }

        return retVal
      } catch (error) {
        console.error(`Failed to load post with ID ${id}. Please try again.`, error)
        return null
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
      const userStore = useUserStore()

      // Check if we can access the session and generate a user hash for storing in the db
      if (!userStore.isLoggedIn) {
        // TODO: Set up a proper error handling module
        throw new Error('User session is invalid')
      }

      const authorHash = await authService.hashInput(userStore.userId, userStore.deployment)
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
    }
  }
})
