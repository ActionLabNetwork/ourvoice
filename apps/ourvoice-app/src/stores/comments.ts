import { defineStore } from 'pinia'
import { apolloClient } from './../graphql/client/index'
// import { CREATE_COMMENT_MUTATION } from '@/graphql/mutations/createComment'
import { CREATE_MODERATION_COMMENT_MUTATION } from '@/graphql/mutations/createModerationComment'
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
  authorHash: string
  authorNickname: string
  post: {
    id: number
  }
  parent: {
    id: number
    authorNickname: string
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
          post: {
            id: comment.node.post.id
          },
          parent: comment.node.parent?.id
            ? {
                id: comment.node.parent.id,
                authorNickname: comment.node.parent.authorNickname
              }
            : null
        }))
        this.pageInfo = data.comments.pageInfo
        this.totalCount = data.comments.totalCount
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
      authorHash,
      authorNickname
    }: {
      content: string
      postId: number | undefined
      parentId: number | undefined
      authorHash: string
      authorNickname: string
    }) {
      try {
        console.log({
          content,
          parentId,
          postId,
          authorHash,
          authorNickname
        })
        const { data } = await apolloClient.mutate({
          mutation: CREATE_MODERATION_COMMENT_MUTATION,
          variables: {
            data: {
              authorHash,
              authorNickname,
              content,
              parentId: parentId ?? null,
              postId: postId ?? null,
              requiredModerations: 3
            }
          }
        })
        console.log(data)
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
