import { useUserStore } from './user'
import { CREATE_MODERATION_POST_MUTATION } from './../graphql/mutations/createModerationPost'
import { apolloClient } from './../graphql/client/index'
import { VOTE_POST_MUTATION } from './../graphql/mutations/votePost'
import { CREATE_POST_MUTATION } from './../graphql/mutations/createPost'
import { GET_POSTS_QUERY } from './../graphql/queries/getPosts'
import { defineStore } from 'pinia'
import { provideApolloClient, useQuery, useMutation } from '@vue/apollo-composable'
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
      const { onResult, onError } = useQuery(GET_POSTS_QUERY, {
        limit: 3
      })

      onResult(({ data, loading }) => {
        this.data = data.posts.edges.map((edge: any) => edge.node)
        this.totalCount = data.posts.totalCount
        this.pageInfo = data.posts.pageInfo
        this.loading = loading
      })

      onError((error) => {
        this.error = error
        if (error) {
          this.errorMessage = 'Failed to load posts. Please try again.'
        }
      })
    },

    async getPresignedUrls(bucket: string, keys: string[], expiresIn: number) {
      const { onResult, onError } = useQuery(GET_PRESIGNED_URLS_QUERY, {
        bucket,
        keys,
        expiresIn
      })

      return new Promise((resolve, reject) => {
        onResult(({ data, loading }) => {
          if (!loading) {
            resolve(data.getPresignedUrls)
          }
        })

        onError((error) => {
          reject(error)
        })
      })
    },

    async createPost({
      title,
      content,
      categoryIds,
      files,
    }: {
      title: string
      content: string
      categoryIds: number[]
      files: string[]
    }) {
      // Check for valid deployment and user session
      const userStore = useUserStore()

      // const { mutate: createPostMutate } = useMutation(CREATE_POST_MUTATION)
      const { mutate: createModerationPostMutate } = useMutation(CREATE_MODERATION_POST_MUTATION)

      // Check if we can access the session and generate a user hash for storing in the db
      if (!userStore.isLoggedIn) {
        // TODO: Set up a proper error handling module
        throw new Error('User session is invalid')
      }

      const authorHash = await authService.hashInput(userStore.userId, userStore.deployment)
      const requiredModerations = 1

      // await createPostMutate({
      //   data: { title, content, categoryIds, files, authorId }
      // })

      try {
        console.log({ title, content, categoryIds, files, authorHash, requiredModerations })
        await createModerationPostMutate({
          data: {
            title,
            content,
            categoryIds,
            files,
            authorHash,
            requiredModerations
          }
        })
      } catch (error) {
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
      const { mutate } = useMutation(VOTE_POST_MUTATION)

      await mutate({
        data: { postId, userId, voteType }
      })
    }
  }
})
