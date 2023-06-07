import { useDeploymentStore } from './deployment'
import { useUserStore } from './user'
import { CREATE_MODERATION_POST_MUTATION } from './../graphql/mutations/createModerationPost'
import { apolloClient } from './../graphql/client/index'
import { VOTE_POST_MUTATION } from './../graphql/mutations/votePost'
import { CREATE_POST_MUTATION } from './../graphql/mutations/createPost'
import { GET_POSTS_QUERY } from './../graphql/queries/getPosts'
import { defineStore } from 'pinia'
import { provideApolloClient } from '@vue/apollo-composable'
import { GET_PRESIGNED_URLS_QUERY } from '@/graphql/queries/getPresignedUrls'

import authService from '@/services/auth-service'

export interface Post {
  id: number
  title: string
  content: string
  createdAt: string
  author: {
    id: number
    nickname: string
  }
  categories: {
    id: number
    name: string
  }[]
  comments: {
    id: number
    content: string
  }[]
  votesUp: number
  votesDown: number
}

export interface pageInfo {
  endCursor: string
  hasNextPage: boolean
  startCursor: string
}

export interface PostsState {
  data: Post[]
  totalCount: number
  pageInfo: pageInfo | undefined
  loading: boolean
  error: Error | undefined
  errorMessage: string | undefined
}

provideApolloClient(apolloClient)

export const usePostsStore = defineStore('posts', {
  state: (): PostsState => ({
    data: [],
    totalCount: 0,
    pageInfo: undefined,
    loading: false,
    error: undefined,
    errorMessage: undefined
  }),

  actions: {
    async fetchPosts() {
      try {
        const { data } = await apolloClient.query({
          query: GET_POSTS_QUERY
        })

        this.data = data.posts.edges.map((edge: any) => edge.node)
        this.totalCount = data.posts.totalCount
        this.pageInfo = data.posts.pageInfo
        console.log({ data })
      } catch (error) {
        console.log(error)
        this.error = error
        if (error) {
          this.errorMessage = 'Failed to load posts. Please try again.'
        }
      }
    },

    async getPresignedUrls(bucket: string, keys: string[], expiresIn: number) {
      try {
        const { data } = await apolloClient.query({
          query: GET_PRESIGNED_URLS_QUERY,
          variables: { bucket, keys, expiresIn }
        })
        return data.getPresignedUrls
      } catch (error) {
        this.error = error
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
      if (!userStore.isLoggedIn) {
        // TODO: Set up a proper error handling module
        throw new Error('User session is invalid')
      }

      const authorHash = useUserStore().sessionHash
      const authorNickname = useUserStore().nickname

      // TODO: Fetch this from deployment config instead of hardcoding
      const requiredModerations = 3

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
              authorNickname,
              requiredModerations
            }
          }
        })
      } catch (error) {
        this.error = error
        console.log({ error })
      }
    },

    async votePost({
      postId,
      userId,
      voteType
    }: {
      postId: number
      userId: number
      voteType: string
    }) {
      await apolloClient.mutate({
        mutation: VOTE_POST_MUTATION,
        variables: { data: { postId, userId, voteType } }
      })
    }
  }
})
