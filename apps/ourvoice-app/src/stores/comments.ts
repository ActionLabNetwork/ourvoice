import { defineStore } from 'pinia'
import { apolloClient } from './../graphql/client/index'
import { CREATE_MODERATION_COMMENT_MUTATION } from '@/graphql/mutations/createModerationComment'
import { DELETE_COMMENT_MUTATION } from '@/graphql/mutations/deleteComment'
import { UPDATE_COMMENT_MUTATION } from '@/graphql/mutations/updateComment'
import { GET_COMMENTS_QUERY } from '@/graphql/queries/getComments'
// import type { GetCommentsQuery } from '@/graphql/generated/graphql'
// import { GET_COMMENT_BY_ID_QUERY } from '@/graphql/queries/getCommentById'
import { provideApolloClient } from '@vue/apollo-composable'
import type { ApolloError } from '@apollo/client/errors'
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

// type Unpacked<T> = T extends (infer U)[] ? U : T
// type CommentsEdge = Unpacked<GetCommentsQuery['comments']['edges']>

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
  getters: {
    getCommentById: (state) => (id: number) => {
      return state.data.find((comment) => comment.id === id)
    }
  },
  actions: {
    async fetchComments(postId: number | null, loadMore = false) {
      try {
        this.loading = true
        const { data } = await apolloClient.query({
          query: GET_COMMENTS_QUERY,
          variables: {
            filter: {
              postId: postId
            },
            pagination: {
              limit: null,
              cursor: loadMore && this.pageInfo ? this.pageInfo.endCursor : null
            }
          }
        })

        const newComments = data.comments.edges.map((comment: any) => ({
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
        this.data = loadMore ? [...this.data, ...newComments] : newComments
        this.pageInfo = data.comments.pageInfo
        this.totalCount = data.comments.totalCount
        this.loading = false
      } catch (error) {
        this.error = error as ApolloError
        this.errorMessage = 'Failed to load comements. Please try again.'
        this.loading = false
      }
    },

    async loadMoreComments(postId: number | null) {
      try {
        if (this.pageInfo?.hasNextPage) {
          this.fetchComments(postId, true)
          console.log('fetching more comments')
        }
      } catch (error) {
        if (error instanceof Error) {
          this.error = error
        }
        if (error) {
          this.errorMessage = 'Failed to load more comments. Please try again.'
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
        const { data } = await apolloClient.mutate({
          mutation: CREATE_MODERATION_COMMENT_MUTATION,
          variables: {
            data: {
              authorHash,
              authorNickname,
              content,
              parentId: parentId ?? null,
              postId: postId ?? null
            }
          }
        })
        // console.log(data)
        return data
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
    },

    async syncVotesForCommentById({
      commentId,
      votesUp,
      votesDown,
      authorHash,
      voteType
    }: {
      commentId: number
      votesUp: number
      votesDown: number
      authorHash: string
      voteType: string
    }) {
      try {
        //sync votesUp/votesDown state with the comment table
        const storedComment = this.data.find((comment) => comment.id === commentId)!
        storedComment.votesUp = votesUp
        storedComment.votesDown = votesDown
        // TODO: sync votes in comments store once the vote mutation is implemented
        // const userVoteForStoredComment = storedComment.votes.find(
        //   (vote) => vote.authorHash === authorHash
        // )
        // if (userVoteForStoredComment) {
        //   if (userVoteForStoredComment.voteType === voteType) {
        //     storedComment.votes = storedComment.votes.filter((vote) => vote.authorHash !== authorHash)
        //   } else {
        //     userVoteForStoredComment.voteType = voteType
        //   }
        // } else {
        //   storedComment.votes.push({ authorHash, voteType })
        // }
      } catch (error) {
        if (error instanceof Error) {
          this.error = error
        }
      }
    }
  }
})
