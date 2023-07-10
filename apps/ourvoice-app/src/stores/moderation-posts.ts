import { GET_CATEGORIES_QUERY } from './../graphql/queries/getCategories'
import { apolloClient } from './../graphql/client/index'
import { GET_MODERATION_POSTS_QUERY } from './../graphql/queries/getModerationPosts'
import { defineStore } from 'pinia'
import { provideApolloClient } from '@vue/apollo-composable'

import type { ApolloError } from '@apollo/client/errors'

type PostStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

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
  hasNextPage: boolean
  startCursor: string
}

interface PostsResponse {
  posts: ModerationPost[]
  totalCount: number
  pageInfo: PageInfo | undefined
}

export interface ModerationPostsState {
  posts: ModerationPost[]
  pendingPosts: PostsResponse
  acceptedPosts: PostsResponse
  rejectedPosts: PostsResponse
  categories: Map<number, Category>
  totalCount: number
  pageInfo: PageInfo | undefined
  loading: boolean
  error: Error | undefined
  errorMessage: string | undefined
}

interface Edge<T> {
  cursor: string
  node: T
}

provideApolloClient(apolloClient)

export const useModerationPostsStore = defineStore('moderation-posts', {
  state: (): ModerationPostsState => ({
    posts: [],
    pendingPosts: { posts: [], totalCount: 0, pageInfo: undefined },
    acceptedPosts: { posts: [], totalCount: 0, pageInfo: undefined },
    rejectedPosts: { posts: [], totalCount: 0, pageInfo: undefined },
    categories: new Map(),
    totalCount: 0,
    pageInfo: undefined,
    loading: false,
    error: undefined,
    errorMessage: undefined
  }),
  actions: {
    async fetchPosts1(status: PostStatus) {
      try {
        // Fetch posts from Moderation DB
        this.loading = true

        const { data } = await apolloClient.query({
          query: GET_MODERATION_POSTS_QUERY,
          variables: { status: status }
        })

        const newPosts = data.moderationPosts.edges.map(
          (edge: Edge<ModerationPostModel>) => edge.node
        )

        switch (status) {
          case 'PENDING':
            this.pendingPosts = newPosts
            break
          case 'APPROVED':
            this.acceptedPosts = newPosts
            break
          case 'REJECTED':
            this.rejectedPosts = newPosts
            break
        }
      } catch (error) {
        // TODO: Handle error
      }
    },
    async fetchPosts(loadMore = false) {
      try {
        // Fetch posts from Moderation DB
        this.loading = true

        const { data } = await apolloClient.query({
          query: GET_MODERATION_POSTS_QUERY,
          variables: this.pageInfo && loadMore ? { after: this.pageInfo.endCursor } : {}
        })

        // If we're loading more posts, append them. Otherwise, replace the posts.
        const newPosts = data.moderationPosts.edges.map(
          (edge: Edge<ModerationPostModel>) => edge.node
        )
        this.posts = loadMore ? [...this.posts, ...newPosts] : newPosts

        this.totalCount = data.moderationPosts.totalCount
        this.pageInfo = data.moderationPosts.pageInfo

        // Fetch category names from Main DB
        const categoryIds = Array.from(
          this.posts.reduce((acc, post: ModerationPost) => {
            post.versions
              .flatMap((version) => version.categoryIds)
              .forEach((id) => {
                acc.add(id)
              })
            return acc
          }, new Set())
        )

        const { data: categoriesData } = await apolloClient.query({
          query: GET_CATEGORIES_QUERY,
          variables: { filter: { ids: categoryIds } }
        })

        const categories = categoriesData.categories.edges.map(
          (edge: Edge<Category>) => edge.node
        ) as Category[]

        const categoriesMap = categories.reduce((acc, category) => {
          acc.set(category.id, category)
          return acc
        }, new Map<number, Category>())

        this.categories = categoriesMap

        // Replace category Ids in each post with categories
        this.posts = this.posts.map((post) => {
          const versionsWithCategoriesIncluded = post.versions.map((version) => {
            const categoryObjs: Category[] = []

            version.categoryIds.forEach((categoryId: number) => {
              const category = categoriesMap.get(categoryId)
              if (category) {
                categoryObjs.push(category)
              }
            })

            return { ...version, categories: categoryObjs }
          })
          return { ...post, versions: versionsWithCategoriesIncluded }
        })

        if (this.pageInfo?.hasNextPage) {
          await this.loadMorePosts()
        }
      } catch (error) {
        this.error = error as ApolloError
        this.errorMessage = 'Failed to load posts. Please try again.'
      } finally {
        this.loading = false
      }
    },
    async loadMorePosts() {
      await this.fetchPosts(true)
    }
  }
})
