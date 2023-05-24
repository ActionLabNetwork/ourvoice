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

export interface PostVersion {
  id: number
  title: string
  content: string
  categoryIds: number[]
  files: string[]
  version: number
  timestamp: string
  status: PostStatus
}

export interface ModerationPost {
  id: number
  authorHash: string
  requiredModerations: number
  status: PostStatus
  versions: PostVersion[]
}

export interface pageInfo {
  endCursor: string
  hasNextPage: boolean
  startCursor: string
}

export interface ModerationPostsState {
  posts: ModerationPost[]
  totalCount: number
  pageInfo: pageInfo | undefined
  loading: boolean
  error: Error | undefined
  errorMessage: string | undefined
}

interface Edge {
  cursor: string
  node: ModerationPost
}

provideApolloClient(apolloClient)

export const useModerationPostsStore = defineStore('moderation-posts', {
  state: (): ModerationPostsState => ({
    posts: [],
    totalCount: 0,
    pageInfo: undefined,
    loading: false,
    error: undefined,
    errorMessage: undefined
  }),

  actions: {
    async fetchPosts() {
      try {
        this.loading = true
        const { data } = await apolloClient.query({
          query: GET_MODERATION_POSTS_QUERY
        })
        this.posts = data.moderationPosts.edges.map((edge: Edge) => edge.node)
        this.totalCount = data.moderationPosts.totalCount
        this.pageInfo = data.moderationPosts.pageInfo
        console.log(this.posts)
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

        return data.moderationPost
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
