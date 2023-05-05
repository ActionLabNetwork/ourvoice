import { defineStore } from 'pinia'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { CREATE_COMMENT_MUTATION } from '@/graphql/mutations/createComment'
import { GET_COMMENTS_QUERY } from '@/graphql/queries/getComments'

export interface CommentsState {
  data: {
    id: number
    content: string
    author: Object | null
    post: Object | null
    parent: Object | null
  }[]
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
    },

    getGroupedComments(state) {
      const commentsForPosts: {
        id: number
        content: string
        author: Object | null
        post: Object | null
        parent: Object | null
      }[] = []
      const commentsForComments: {
        id: number
        content: string
        author: Object | null
        post: Object | null
        parent: Object | null
      }[] = []
      state.data.forEach((c) => {
        if (c.parent) {
          commentsForComments.push(c)
        }
        if (c.post) {
          commentsForPosts.push(c)
        }
      })
      return [
        {
          label: 'Comments for Posts',
          options: commentsForPosts
        },
        {
          label: 'Comments for Comments',
          options: commentsForComments
        }
      ]
    }
  },
  actions: {
    async fetchComments() {
      const { onResult, onError } = useQuery(GET_COMMENTS_QUERY)

      onResult(({ data, loading }) => {
        this.data = data.comments.edges.map((comment: any) => ({
          id: comment.node.id,
          content: comment.node.content,
          author: comment.node.author ?? null,
          post: comment.node.post ?? null,
          parent: comment.node.parent ?? null
        }))
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
      // const result = undefined
      const { mutate } = useMutation(CREATE_COMMENT_MUTATION)
      await mutate({
        data: {
          content,
          postId,
          parentId,
          authorId
        }
      }).then((response) => {
        console.log('response: ', response)
        this.$patch((state) => {
          state.data.push(response?.data.createComment)
        })
      })
    }
  }
})
