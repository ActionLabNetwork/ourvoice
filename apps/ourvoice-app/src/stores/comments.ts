import { defineStore } from 'pinia'
import { useQuery, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export interface CommentsState {
  data: { id: number; content: string }[]
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

  actions: {
    async fetchComments() {
      const { onResult, onError } = useQuery(
        gql`
          query {
            comments {
              id
              content
            }
          }
        `
      )

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
      const { mutate } = useMutation(
        gql`
          mutation CreateComment($data: CommentCreateInput!) {
            createComment(data: $data) {
              id
              content
            }
          }
        `
      )
      await mutate({
        data: {
          content,
          postId,
          parentId,
          authorId
        }
      }).then((r) => {
        console.log(r?.data)
      })
    }
  }
})
