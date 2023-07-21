import { MODERATION_LIST_POSTS_PER_PAGE } from './../constants/moderation'
import { apolloClient } from './../graphql/client/index'
import { GET_MODERATION_POSTS_QUERY } from './../graphql/queries/getModerationPosts'
import { defineStore } from 'pinia'
import { provideApolloClient } from '@vue/apollo-composable'

export type PostStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

interface PostVersionWithCategoryIds {
  id: number
  title: string
  content: string
  categoryIds: number[]
  files: string[]
  version: number
  timestamp: string
  status: PostStatus
  authorHash: string
  authorNickname: string
  reason: string
  latest: boolean
  moderations: Moderation[]
  attachmentsDownloadUrls?: { key: string; url: string }[]
}

export interface PostVersion extends Omit<PostVersionWithCategoryIds, 'categories'> {
  categories: Category[]
}
export interface ModerationPostModel {
  id: number
  authorHash: string
  authorNickname: string
  requiredModerations: number
  status: PostStatus
  versions: PostVersionWithCategoryIds[]
}
export interface ModerationPost extends Omit<ModerationPostModel, 'versions'> {
  versions: PostVersion[]
}
export interface Moderation {
  id: number
  decision: 'ACCEPTED' | 'REJECTED'
  moderatorHash: string
  moderatorNickname: string
  reason: string
  timestamp: string
}

export interface Category {
  id: number
  name: string
}

export interface PageInfo {
  endCursor: string
  hasPreviousPage: boolean
  hasNextPage: boolean
  startCursor: string
}

export interface ModerationPostsState {
  posts: ModerationPost[]
  totalCount: number
  startCursor: string | null
  endCursor: string | null
  hasNextPage: boolean
  loading: boolean
}

interface Edge<T> {
  node: T
}

provideApolloClient(apolloClient)

export const useModerationPostsStore = defineStore('moderation-posts', {
  state: (): ModerationPostsState => ({
    posts: [],
    totalCount: 0,
    startCursor: null,
    endCursor: null,
    hasNextPage: false,
    loading: false
  }),
  actions: {
    async fetchPostsByStatus(
      status: PostStatus,
      before: string | null = null,
      after: string | null = null
    ) {
      try {
        // Fetch posts from Moderation DB
        this.loading = true

        const { data } = await apolloClient.query({
          query: GET_MODERATION_POSTS_QUERY,
          variables: {
            status: status,
            published: status === 'APPROVED' ? false : undefined,
            archived: status === 'REJECTED' ? false : undefined,
            limit: MODERATION_LIST_POSTS_PER_PAGE,
            before: before,
            after: after
          },
          fetchPolicy: 'no-cache'
        })

        const newPosts = data.moderationPosts.edges.map(
          (edge: Edge<ModerationPostModel>) => edge.node
        )

        this.posts = newPosts
        this.totalCount = data.moderationPosts.totalCount
        this.startCursor = data.moderationPosts.pageInfo.startCursor
        this.endCursor = data.moderationPosts.pageInfo.endCursor

        const forwardPaginating =
          (before === null && after !== null) || (before === null && after === null)
        const backwardPaginating = before !== null && after === null

        if (backwardPaginating) {
          this.hasNextPage = true
        }

        if (forwardPaginating) {
          this.hasNextPage = data.moderationPosts.pageInfo.hasNextPage
        }

        this.loading = false
      } catch (error) {
        console.error(error)
      }
    },
    async fetchPreviousPostsByStatus(status: PostStatus) {
      this.loading = true
      try {
        this.fetchPostsByStatus(status, this.startCursor, null)
      } catch (error) {
        console.error(error)
      }
      this.loading = false
    },
    async fetchNextPostsByStatus(status: PostStatus) {
      this.loading = true
      try {
        this.fetchPostsByStatus(status, null, this.endCursor)
      } catch (error) {
        console.error(error)
      }
      this.loading = false
    }
  }
})
