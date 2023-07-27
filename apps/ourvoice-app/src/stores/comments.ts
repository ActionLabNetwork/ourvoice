import { defineStore } from 'pinia'
import { apolloClient, evictItem } from './../graphql/client/index'
import { CREATE_MODERATION_COMMENT_MUTATION } from '@/graphql/mutations/createModerationComment'
import { DELETE_COMMENT_MUTATION } from '@/graphql/mutations/deleteComment'
import { UPDATE_COMMENT_MUTATION } from '@/graphql/mutations/updateComment'
import { GET_COMMENTS_QUERY } from '@/graphql/queries/getComments'
import type { GetCommentsQuery } from '@/graphql/generated/graphql'
import { provideApolloClient } from '@vue/apollo-composable'
import type { ApolloError } from '@apollo/client/errors'

export interface pageInfo {
  endCursor: string | null
  hasNextPage: boolean | null
  startCursor: string | null
}

type Unpacked<T> = T extends (infer U)[] ? U : T
type CommentsEdge = Unpacked<GetCommentsQuery['comments']['edges']>

export interface CommentsState {
  data: Array<CommentsEdge['node']>
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

        if (!data) {
          throw Error('data is null')
        }
        const comments = data?.comments
        if (!comments) {
          throw Error('comments is null')
        }

        const newComments = comments.edges.map((edge) => edge.node)

        this.data = loadMore ? [...this.data, ...newComments] : newComments
        this.pageInfo = data.comments.pageInfo ?? undefined
        this.totalCount = data.comments.totalCount
        this.loading = false
      } catch (error) {
        this.error = error as ApolloError
        this.errorMessage = 'Failed to load comments. Please try again.'
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
        const storedComment = { ...this.data.find((comment) => comment.id === commentId)! }
        evictItem(storedComment)
        storedComment.votesUp = votesUp
        storedComment.votesDown = votesDown
        const userVoteForStoredComment = storedComment.votes.find(
          (vote) => vote.authorHash === authorHash
        )
        if (userVoteForStoredComment) {
          if (userVoteForStoredComment.voteType === voteType) {
            storedComment.votes = storedComment.votes.filter(
              (vote) => vote.authorHash !== authorHash
            )
          } else {
            storedComment.votes = storedComment.votes.map((vote) => {
              if (vote.authorHash !== authorHash) {
                return vote
              }
              return { ...vote, voteType }
            })
          }
        } else {
          storedComment.votes = [...storedComment.votes, { authorHash, voteType }]
        }
        this.data = this.data.map((comment) => (comment.id === commentId ? storedComment : comment))
      } catch (error) {
        console.log(error)
        if (error instanceof Error) {
          this.error = error
        }
      }
    }
  }
})
