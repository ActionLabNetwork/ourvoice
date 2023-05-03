import { defineStore } from 'pinia'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { CREATE_COMMENT_MUTATION } from '@/graphql/mutations/createComment'
import { GET_COMMENTS_QUERY } from '@/graphql/queries/getComments'

export interface CommentsState {
  data: { id: number; content: string; author: Object; post: Object; parent: Object }[]
  loading: boolean
  error: Error | undefined
  errorMessage: string | undefined
}

export const useCommentsStore = defineStore('comments', {
  state: (): CommentsState => ({
    data: [],
    loading: false,
    error: undefined,
    errorMessage: undefined
  }),
  getters: {
    getCommentslength(state) {
      return state.data.length
    }
  },
  actions: {
    async fetchComments() {
      const { onResult, onError } = useQuery(GET_COMMENTS_QUERY)

      onResult(({ data, loading }) => {
        this.data = data.comments
        this.loading = loading
      })

      onError((error) => {
        this.error = error
        if (error) {
          this.errorMessage = 'Failed to load comments. Please try again.'
        }
      })
    },

    async createComment({
      content,
      parentId,
      postId,
      authorId
    }: {
      content: string
      postId: number | undefined
      parentId: number | undefined
      authorId: number
    }) {
      const { mutate } = useMutation(CREATE_COMMENT_MUTATION)
      await mutate({
        data: {
          content,
          postId,
          parentId,
          authorId
        }
      }).then(async (r) => {
        console.log(r?.data)
      })
    }
  }
})
