import { defineStore } from 'pinia'
import { apolloClient } from './../graphql/client/index'
import { CREATE_COMMENT_MUTATION } from '@/graphql/mutations/createComment'
import { DELETE_COMMENT_MUTATION } from '@/graphql/mutations/deleteComment'
import { UPDATE_COMMENT_MUTATION } from '@/graphql/mutations/updateComment'
import { GET_COMMENTS_QUERY } from '@/graphql/queries/getComments'
import { provideApolloClient } from '@vue/apollo-composable'

export interface Comment {
  id: number
  content: string
  votesDown: number
  votesUp: number
  moderated: boolean
  published: boolean
  createdAt: string
  moderatedAt: string
  publishedAt: string
  disabledAt: string
  author: {
    id: number
    nickname: string
  }
  post: {
    id: number
  }
  parent: {
    id: number
    author: {
      id: number
      nickname: string
    }
  }
}
export interface pageInfo {
  endCursor: string
  hasNextPage: boolean
  startCursor: string
}
export interface CommentsState {
  data: Comment[]
  loading: boolean
  error: Error | undefined
  errorMessage: string | undefined
  pageInfo: pageInfo | undefined
  totalCount: number | undefined
}

provideApolloClient(apolloClient)

export const useCommentsStore = defineStore('comments', {
  state: (): CommentsState => ({
    data: [],
    loading: false,
    error: undefined,
    errorMessage: undefined,
    pageInfo: undefined,
    totalCount: undefined
  }),

  actions: {
    async fetchComments() {
      try {
        this.loading = true
        const { data } = await apolloClient.query({ query: GET_COMMENTS_QUERY })

        this.data = data.comments.edges.map((comment: any) => ({
          id: comment.node.id,
          content: comment.node.content,
          votesDown: comment.node.votesDown,
          votesUp: comment.node.votesUp,
          createdAt: comment.node.createdAt,
          authorHash: comment.node.authorHash ?? null,
          authorNickname: comment.node.authorNickname ?? null,
          post: comment.node.post ?? null,
          parent: comment.node.parent ?? null
        }))
        this.loading = false
      } catch (error) {
        if (error instanceof Error) {
          this.error = error
        }

        if (error) {
          this.errorMessage = 'Failed to load comments. Please try again.'
        }
      }
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
      try {
        const response = await apolloClient.mutate({
          mutation: CREATE_COMMENT_MUTATION,
          variables: {
            data: {
              content,
              postId,
              parentId,
              authorId
            }
          }
        })
        console.log('response: ', response)
        this.$patch((state) => {
          state.data.push(response?.data.createComment)
        })
      } catch (error) {
        if (error instanceof Error) {
          this.error = error
        }
      }
    },

    async deleteComment(id: number) {
      try {
        const response = await apolloClient.mutate({
          mutation: DELETE_COMMENT_MUTATION,
          variables: {
            deleteCommentId: id
          }
        })
        console.log(response)
      } catch (error) {
        if (error instanceof Error) {
          this.error = error
        }
      }
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
      try {
        const response = await apolloClient.mutate({
          mutation: UPDATE_COMMENT_MUTATION,
          variables: {
            updateCommentId: id,
            data: {
              content: data.content,
              authorId: data.authorId,
              published: data.published,
              moderated: data.moderated
            }
          }
        })
        console.log(response)
      } catch (error) {
        if (error instanceof Error) {
          this.error = error
        }
      }
    }
  }
})
