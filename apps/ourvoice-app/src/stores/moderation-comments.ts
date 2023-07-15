import { MODERATION_LIST_COMMENTS_PER_PAGE } from './../constants/moderation'
import { apolloClient } from './../graphql/client/index'
import { defineStore } from 'pinia'
import { provideApolloClient } from '@vue/apollo-composable'

import { GET_MODERATION_COMMENTS_QUERY } from '@/graphql/queries/getModerationComments'
import type { PostVersion } from './moderation-posts'

type CommentStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface ModerationPost {
  id: number
  authorHash: string
  authorNickname: string
  versions: PostVersion[]
  requiredModerations: number
  status: CommentStatus
}
export interface CommentVersion {
  id: number
  content: string
  version: number
  timestamp: string
  status: CommentStatus
  authorHash: string
  authorNickname: string
  reason: string
  latest: boolean
  moderations: Moderation[]
}

export interface ModerationComment {
  id: number
  authorHash: string
  authorNickname: string
  requiredModerations: number
  status: CommentStatus
  post: ModerationPost
  parent: ModerationComment | null
  versions: CommentVersion[]
}

export interface Moderation {
  id: number
  decision: 'ACCEPTED' | 'REJECTED'
  moderatorHash: string
  moderatorNickname: string
  reason: string
  timestamp: string
}

export interface ModerationCommentsState {
  comments: ModerationComment[]
  totalCount: number
  startCursor: string | null
  endCursor: string | null
  hasNextPage: boolean
  loading: boolean
}

interface Edge<T> {
  cursor: string
  node: T
}

provideApolloClient(apolloClient)

export const useModerationCommentsStore = defineStore('moderation-comments', {
  state: (): ModerationCommentsState => ({
    comments: [],
    totalCount: 0,
    startCursor: null,
    endCursor: null,
    hasNextPage: false,
    loading: false
  }),
  actions: {
    async fetchCommentsByStatus(
      status: CommentStatus,
      before: string | null = null,
      after: string | null = null
    ) {
      try {
        this.loading = true

        const { data } = await apolloClient.query({
          query: GET_MODERATION_COMMENTS_QUERY,
          variables: {
            status: status,
            limit: MODERATION_LIST_COMMENTS_PER_PAGE,
            before: before,
            after: after
          },
          fetchPolicy: 'no-cache'
        })

        const newComments = data.moderationComments.edges.map(
          (edge: Edge<ModerationComment>) => edge.node
        )

        if (newComments.length > 0) {
          this.comments = newComments
          this.totalCount = data.moderationComments.totalCount
          this.startCursor = data.moderationComments.pageInfo.startCursor
          this.endCursor = data.moderationComments.pageInfo.endCursor

          const forwardPaginating =
            (before === null && after !== null) || (before === null && after === null)
          const backwardPaginating = before !== null && after === null

          if (backwardPaginating) {
            this.hasNextPage = true
          }

          if (forwardPaginating) {
            this.hasNextPage = data.moderationComments.pageInfo.hasNextPage
          }
        }
        this.loading = false
      } catch (error) {
        console.error(error)
      }
    },
    async fetchPreviousCommentsByStatus(status: CommentStatus) {
      try {
        this.fetchCommentsByStatus(status, this.startCursor, null)
      } catch (error) {
        console.error(error)
      }
    },
    async fetchNextCommentsByStatus(status: CommentStatus) {
      try {
        this.fetchCommentsByStatus(status, null, this.endCursor)
      } catch (error) {
        console.error(error)
      }
    }
  }
})
