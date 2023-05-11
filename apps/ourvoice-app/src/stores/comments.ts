import { defineStore } from 'pinia'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { CREATE_COMMENT_MUTATION } from '@/graphql/mutations/createComment'
import { DELETE_COMMENT_MUTATION } from '@/graphql/mutations/deleteComment'
import { UPDATE_COMMENT_MUTATION } from '@/graphql/mutations/updateComment'
import { GET_COMMENTS_QUERY } from '@/graphql/queries/getComments'

export interface Comment {
  id: number
  content: string
  createdAt: string
  author: {
    id: number
    nickname: string
  }
  post: {
    id: number
    title: string
  }
  parent: {
    id: number
    content: string
  }
}
export interface CommentsState {
  data: Comment[]
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
      const commentsForPosts: Comment[] = []
      const commentsForComments: Comment[] = []
      state.data.forEach((c) => {
        if (c.parent) {
          commentsForComments.push(c)
        } else if (c.post) {
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
    },

    getCommentsByPostId: (state) => (postId: number) => {
      return state.data.filter((c) => c.post?.id === postId)
    }
  },
  actions: {
    async fetchComments() {
      const { onResult, onError } = useQuery(GET_COMMENTS_QUERY)

      onResult(({ data, loading }) => {
        this.data = data.comments.edges.map((comment: any) => ({
          id: comment.node.id,
          content: comment.node.content,
          createdAt: comment.node.createdAt,
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
    },

    async deleteComment(id: number) {
      const { mutate } = useMutation(DELETE_COMMENT_MUTATION)
      await mutate({ deleteCommentId: id }).then((response) => {
        console.log('response: ', response)
      })
    },

    async updateComment({
      id,
      data
    }: {
      id: number
      data: {
        content: string
        authorId: number
        published: boolean
        moderated: boolean
      }
    }) {
      const { mutate } = useMutation(UPDATE_COMMENT_MUTATION)
      await mutate({
        updateCommentId: id,
        data: {
          content: data.content,
          authorId: data.authorId,
          published: data.published,
          moderated: data.moderated
        }
      }).then((response) => {
        console.log('response: ', response)
      })
    }
  }
})
