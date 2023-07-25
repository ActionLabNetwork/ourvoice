import { apolloClient } from '@/graphql/client'
import type {
  PollCreateInput,
  PollPageInfo,
  PollUpdateInput,
  PollWithResult
} from '@/graphql/generated/graphql'
import { CREATE_POLL_MUTATION } from '@/graphql/mutations/createPoll'
import { REMOVE_POLL_MUTATION } from '@/graphql/mutations/removePoll'
import { UPDATE_POLL_MUTATION } from '@/graphql/mutations/updatePoll'
import { GET_POLLS_WITH_RESULT_QUERY } from '@/graphql/queries/getPollsWithResult'
import { provideApolloClient } from '@vue/apollo-composable'
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export interface ModerationPollState {
  polls: PollWithResult[]
  pageInfo: PollPageInfo | undefined | null
  totalCount: number | undefined | null
  state: 'initial' | 'loading-initial' | 'loaded' | 'loading-more' | 'error'
  error: Error | null
}

provideApolloClient(apolloClient)

export const useModerationPollStore = defineStore('moderation-poll', {
  state: (): ModerationPollState => ({
    polls: [],
    pageInfo: null,
    totalCount: null,
    state: 'initial',
    error: null
  }),
  actions: {
    async fetchPolls(loadMore: boolean = false) {
      try {
        this.state = loadMore ? 'loading-more' : 'loading-initial'
        const moderatorHash = await this.getModeratorHash()
        const { data } = await apolloClient.query({
          query: GET_POLLS_WITH_RESULT_QUERY,
          variables: { moderatorHash, filter: {}, pagination: {} }
        })
        const connection = data.pollsWithResult
        const newPolls = connection.edges.map((edge) => edge.node)
        this.polls = loadMore ? [...this.polls, ...newPolls] : newPolls
        this.pageInfo = connection.pageInfo
        this.totalCount = connection.totalCount
        this.state = 'loaded'
      } catch (e) {
        if (e instanceof Error) {
          this.error = e
        }
        this.state = 'error'
      } 
    },
    async createPoll(input: PollCreateInput) {
      try {
        const { data } = await apolloClient.mutate({
          mutation: CREATE_POLL_MUTATION,
          variables: {
            data: input
          }
        })
        if (!data) {
          throw Error('No data returned')
        }
        const createdPoll = data.createPoll
        const dataWithResult = {
          ...createdPoll,
          options: createdPoll.options.map((option) => ({
            ...option,
            numVotes: 0
          }))
        }
        this.polls = [dataWithResult, ...this.polls]
      } catch (error) {
        if (error instanceof Error) {
          this.error = error
        }
      }
    },
    async updatePoll(pollId: number, input: PollUpdateInput) {
      const { data } = await apolloClient.mutate({
        mutation: UPDATE_POLL_MUTATION,
        variables: { pollId, data: input, x: 1 }
      })
      if (!data) {
        throw Error('No data is returned')
      }
      const updatedPoll = data.updatePoll
      this.polls = this.polls.map((poll) => {
        if (poll.id === updatedPoll.id) {
          if (input.options) {
            return {
              ...poll,
              options: updatedPoll.options.map((option) => ({
                ...option,
                numVotes: 0
              }))
            }
          } else {
            return { ...updatedPoll, options: poll.options }
          }
        }
        return poll
      })
      return updatedPoll
    },
    async removePoll(pollId: number) {
      const { data } = await apolloClient.mutate({
        mutation: REMOVE_POLL_MUTATION,
        variables: { pollId }
      })
      if (!data) {
        throw Error('No data is returned')
      }
      const returnedPollId = data.removePoll as number
      this.polls = this.polls.filter((poll) => poll.id !== returnedPollId)
    },
    async getModeratorHash() {
      const userStore = useUserStore()
      if (!(await userStore.isLoggedIn)) {
        throw new Error('user session is invalid')
      }
      return userStore.sessionHash
    }
  }
})
