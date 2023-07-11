import { useUserStore } from './user'
import { CREATE_MODERATION_POST_MUTATION } from './../graphql/mutations/createModerationPost'
import { apolloClient } from './../graphql/client/index'
import { VOTE_MUTATION } from './../graphql/mutations/createOrDeleteVote'
import { GET_POSTS_QUERY } from './../graphql/queries/getPosts'
import { GET_POST_BY_ID_QUERY } from './../graphql/queries/getPostById'
import { defineStore } from 'pinia'
import { provideApolloClient } from '@vue/apollo-composable'
import { GET_PRESIGNED_URLS_QUERY } from '@/graphql/queries/getPresignedUrls'
import { type sortOptions, type sortOrder } from '@/constants/post'
import type { ApolloError } from '@apollo/client/errors'
export interface Post {
  id: number
  title: string
  content: string
  createdAt: string
  moderatedAt: string
  publishedAt: string
  published: boolean
  moderated: boolean
  authorHash: string
  authorNickname: string
  categories: {
    id: number
    name: string
  }[]
  comments: {
    id: number
    content: string
  }[]
  votesUp: number
  votesDown: number
  files: string[]
}
export interface SortFilter {
  sortBy: sortOptions
  sortOrder: sortOrder
  selectedCategoryIds: number[] | null
  createdAfter: Date | null
}
export interface pageInfo {
  endCursor: string
  hasNextPage: boolean
  startCursor: string
}
export interface PostsState {
  data: Post[]
  totalCount: number
  pageInfo: pageInfo | undefined
  loading: boolean
  error: Error | undefined
  errorMessage: string | undefined
  sortFilter: SortFilter
}

provideApolloClient(apolloClient)

export const usePostsStore = defineStore('posts', {
  state: (): PostsState => ({
    data: [],
    totalCount: 0,
    pageInfo: undefined,
    loading: false,
    error: undefined,
    errorMessage: undefined,
    sortFilter: {
      sortBy: 'sortByCreatedAt',
      sortOrder: 'desc',
      selectedCategoryIds: null,
      createdAfter: null
    }
  }),
  getters: {
    getPostById: (state) => (id: number) => {
      return state.data.find((post) => post.id === id)
    }
  },
  actions: {
    async fetchPosts(loadMore = false) {
      try {
        const { data } = await apolloClient.query({
          query: GET_POSTS_QUERY,
          variables: {
            sort: {
              [this.sortFilter.sortBy]: this.sortFilter.sortOrder
            },
            pagination: {
              cursor: loadMore && this.pageInfo ? this.pageInfo.endCursor : null
            },
            filter: {
              categoryIds: this.sortFilter.selectedCategoryIds,
              createdAfter: this.sortFilter.createdAfter
            }
          },
          fetchPolicy: 'no-cache'
        })

        const newPosts = data.posts.edges.map((edge: any) => ({
          id: edge.node.id,
          title: edge.node.title,
          content: edge.node.content,
          createdAt: edge.node.createdAt,
          moderatedAt: edge.node.moderatedAt,
          publishedAt: edge.node.publishedAt,
          published: edge.node.published,
          moderated: edge.node.moderated,
          authorHash: edge.node.authorHash,
          authorNickname: edge.node.authorNickname,
          categories: edge.node.categories.map((category: any) => ({
            id: category.id,
            name: category.name
          })),
          comments: edge.node.comments.map((comment: any) => ({
            id: comment.id,
            content: comment.content
          })),
          votesUp: edge.node.votesUp,
          votesDown: edge.node.votesDown,
          files: edge.node.files
        }))

        this.data = loadMore ? [...this.data, ...newPosts] : newPosts
        this.totalCount = data.posts.totalCount
        this.pageInfo = data.posts.pageInfo
      } catch (error) {
        this.error = error as ApolloError
        this.errorMessage = 'Failed to load posts. Please try again.'
      } finally {
        this.loading = false
      }
    },

    async loadMorePosts() {
      try {
        if (this.pageInfo?.hasNextPage) {
          this.fetchPosts(true)
          console.log('fetching more posts')
        }
      } catch (error) {
        if (error instanceof Error) {
          this.error = error
        }
        if (error) {
          this.errorMessage = 'Failed to load more posts. Please try again.'
        }
      }
    },

    async getPresignedUrls(bucket: string, keys: string[], expiresIn: number) {
      try {
        const { data } = await apolloClient.query({
          query: GET_PRESIGNED_URLS_QUERY,
          variables: { bucket, keys, expiresIn }
        })
        return data.getPresignedUrls
      } catch (error) {
        if (error instanceof Error) {
          this.error = error
        }
      }
    },

    async createPost({
      title,
      content,
      categoryIds,
      files
    }: {
      title: string
      content: string
      categoryIds: number[]
      files: string[]
    }) {
      // Check for valid deployment and user session
      const userStore = useUserStore()

      // Check if we can access the session and generate a user hash for storing in the db
      if (!userStore.isLoggedIn) {
        // TODO: Set up a proper error handling module
        throw new Error('User session is invalid')
      }

      const authorHash = useUserStore().sessionHash
      const authorNickname = useUserStore().nickname

      try {
        await apolloClient.mutate({
          mutation: CREATE_MODERATION_POST_MUTATION,
          variables: {
            data: {
              title,
              content,
              categoryIds,
              files,
              authorHash,
              authorNickname,
            }
          }
        })
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.error = error
        }
      }
    },

    async votePost({
      postId,
      userId,
      voteType
    }: {
      postId: number
      userId: number
      voteType: string
    }) {
      await apolloClient.mutate({
        mutation: VOTE_MUTATION,
        variables: { data: { postId, userId, voteType } }
      })
    },

    async syncVotesForPostById(postId: number) {
      try {
        const { data } = await apolloClient.query({
          query: GET_POST_BY_ID_QUERY,
          variables: { postId },
          fetchPolicy: 'no-cache'
        })
        //sync votesUp/votesDown state with the post table
        this.data.find((post) => post.id === postId)!.votesUp = data.post.votesUp
        this.data.find((post) => post.id === postId)!.votesDown = data.post.votesDown
      } catch (error) {
        if (error instanceof Error) {
          this.error = error
        }
      }
    },

    async setSelectedCategoryIds(categoryIds: number[] | null) {
      this.sortFilter = { ...this.sortFilter, selectedCategoryIds: categoryIds }
    },

    async setSortOption(sortBy: string, sortOrder: sortOrder) {
      this.sortFilter.sortBy = sortBy as sortOptions
      this.sortFilter.sortOrder = sortOrder
    },

    async setCreatedAfter(createdAfter: Date | null) {
      this.sortFilter.createdAfter = createdAfter
    },

    async fetchPostById(postId: number) {
      try {
        if (this.getPostById(postId)) return

        const { data } = await apolloClient.query({
          query: GET_POST_BY_ID_QUERY,
          variables: { postId },
          fetchPolicy: 'no-cache'
        })
        this.data.push({
          id: data.post.id,
          title: data.post.title,
          content: data.post.content,
          createdAt: data.post.createdAt,
          moderatedAt: data.post.moderatedAt,
          publishedAt: data.post.publishedAt,
          published: data.post.published,
          moderated: data.post.moderated,
          authorHash: data.post.authorHash,
          authorNickname: data.post.authorNickname,
          categories: data.post.categories.map((category: any) => ({
            id: category.id,
            name: category.name
          })),
          comments: data.post.comments.map((comment: any) => ({
            id: comment.id,
            content: comment.content
          })),
          votesUp: data.post.votesUp,
          votesDown: data.post.votesDown,
          files: data.post.files
        })
      } catch (error) {
        if (error instanceof Error) {
          this.error = error
        }
      }
    }
  }
})
