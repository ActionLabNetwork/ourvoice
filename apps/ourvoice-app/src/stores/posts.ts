import { apolloClient } from './../graphql/client/index'
import { VOTE_POST_MUTATION } from './../graphql/mutations/votePost'
import { CREATE_POST_MUTATION } from './../graphql/mutations/createPost'
import { GET_POSTS_QUERY } from './../graphql/queries/getPosts'
import { defineStore } from 'pinia'
import { provideApolloClient, useQuery, useMutation } from '@vue/apollo-composable'
import { GET_PRESIGNED_URLS_QUERY } from '@/graphql/queries/getPresignedUrls'

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

export interface PostsState {
  data: Post[]
  loading: boolean
  error: Error | undefined
  errorMessage: string | undefined
}

provideApolloClient(apolloClient)

export const usePostsStore = defineStore('posts', {
  state: (): PostsState => ({
    data: [],
    loading: false,
    error: undefined,
    errorMessage: undefined
  }),

  actions: {
    async fetchPosts() {
      const { onResult, onError } = useQuery(GET_POSTS_QUERY)

      onResult(({ data, loading }) => {
        this.data = data.posts.edges.map((edge: any) => edge.node)
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
      authorId
    }: {
      title: string
      content: string
      categoryIds: number[]
      files: string[]
      authorId: number
    }) {
      const { mutate } = useMutation(CREATE_POST_MUTATION)

      await mutate({
        data: { title, content, categoryIds, files, authorId }
      })
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
