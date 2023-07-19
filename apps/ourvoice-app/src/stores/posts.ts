import { type sortOptions, type sortOrder } from '@/constants/post'
import type { GetPostsQuery } from '@/graphql/generated/graphql'
import { GET_PRESIGNED_DOWNLOAD_URLS_QUERY } from '@/graphql/queries/getPresignedDownloadUrls'
import type { ApolloError } from '@apollo/client/errors'
import { provideApolloClient } from '@vue/apollo-composable'
import { defineStore } from 'pinia'
import { apolloClient, evictItem } from './../graphql/client/index'
import { CREATE_MODERATION_POST_MUTATION } from './../graphql/mutations/createModerationPost'
import { VOTE_MUTATION } from './../graphql/mutations/createOrDeleteVote'
import { GET_POST_BY_ID_QUERY } from './../graphql/queries/getPostById'
import { GET_POSTS_QUERY } from './../graphql/queries/getPosts'
import { useUserStore } from './user'

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

type Unpacked<T> = T extends (infer U)[] ? U : T
type PostsEdge = Unpacked<GetPostsQuery['posts']['edges']>

export interface PostsState {
  data: Array<PostsEdge['node']>
  totalCount: number
  pageInfo: pageInfo | undefined
  state: 'initial' | 'loading-initial' | 'loaded' | 'loading-more' | 'error'
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
    state: 'initial',
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
      this.state = loadMore ? 'loading-more' : 'loading-initial'
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
        })

        if (!data) {
          throw Error('data is null')
        }
        const posts = data?.posts
        if (!posts) {
          throw Error('posts is null')
        }

        // console.log(posts.edges[0].node)

        const newPosts = posts.edges.map((edge) => edge.node)

        this.data = loadMore ? [...this.data, ...newPosts] : newPosts
        this.totalCount = data.posts.totalCount ?? 0
        this.pageInfo = data.posts.pageInfo ?? 0
        this.state = 'loaded'
      } catch (error) {
        this.error = error as ApolloError
        this.errorMessage = 'Failed to load posts. Please try again.'
        this.state = 'error'
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
          query: GET_PRESIGNED_DOWNLOAD_URLS_QUERY,
          variables: { bucket, keys, expiresIn }
        })
        return data.getPresignedDownloadUrls
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

      // TODO: Fetch this from deployment config instead of hardcoding
      const requiredModerations = 3

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
              requiredModerations
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

    async syncVotesForPostById({
      postId,
      votesUp,
      votesDown,
      authorHash,
      voteType
    }: {
      postId: number
      votesUp: number
      votesDown: number
      authorHash: string
      voteType: string
    }) {
      try {
        //sync votesUp/votesDown state with the post table
        const storedPost = this.data.find((post) => post.id === postId)!
        storedPost.votesUp = votesUp
        storedPost.votesDown = votesDown
        const userVoteForStoredPost = storedPost.votes.find(
          (vote) => vote.authorHash === authorHash
        )
        if (userVoteForStoredPost) {
          if (userVoteForStoredPost.voteType === voteType) {
            storedPost.votes = storedPost.votes.filter((vote) => vote.authorHash !== authorHash)
          } else {
            userVoteForStoredPost.voteType = voteType
          }
        } else {
          storedPost.votes.push({ authorHash, voteType })
        }
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

    setCreatedAfter(createdAfter: Date | null) {
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
        const post = data?.post
        if (!post) {
          throw Error('post is null')
        }
        this.data.push(post)
      } catch (error) {
        if (error instanceof Error) {
          this.error = error
        }
      }
    }
  }
})
