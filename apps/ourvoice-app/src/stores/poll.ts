import { apolloClient } from '@/graphql/client'
import gql from 'graphql-tag'
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { GET_VOTED_POLLS_QUERY } from '@/graphql/queries/getVotedPolls'
import { GET_AVAILABLE_POLLS_QUERY } from '@/graphql/queries/getAvailablePolls'
import { VOTE_POLL_QUERY } from '@/graphql/mutations/votePoll'
import type {
  Poll,
  PollPageInfo,
  PollWithStats,
  PollWithStatsConnection,
  VoteResponse
} from '@/graphql/generated/graphql'

export interface AvailablePollState extends PollWithStats {
  pollState: 'NOT_VOTED' | 'NO_RESULT' | 'VOTED'
}

export interface PollState {
  availablePolls: AvailablePollState[]
  votedPolls: PollWithStats[]
  pageInfo: PollPageInfo | undefined | null
  totalCount: number | undefined | null
  state: 'initial' | 'loading-initial' | 'loaded' | 'loading-more' | 'error'
  error: Error | null
}

export const usePollStore = defineStore('poll', {
  state: (): PollState => ({
    availablePolls: [],
    votedPolls: [],
    pageInfo: undefined,
    totalCount: undefined,
    state: 'initial',
    error: null
  }),
  actions: {
    async initialLoad() {
      this.state = 'loading-initial'
      try {
        await this.fetchAvailablePolls()
        await this.fetchVotedPolls()
        this.state = 'loaded'
      } catch (e) {
        if (e instanceof Error) {
          this.error = e
        }
        this.state = 'error'
      }
    },
    async loadMore() {
      this.state = 'loading-more'
      try {
        await this.fetchVotedPolls(true)
        this.state = 'loaded'
      } catch(e) {
        if (e instanceof Error) {
          this.error = e
        }
        this.state = 'error'
      }
    },
    async fetchAvailablePolls() {
      const userHash = await this.getVoterHash()
      const { data, errors } = await apolloClient.query({
        query: GET_AVAILABLE_POLLS_QUERY,
        variables: { userHash: userHash }
      })
      this.availablePolls = data.availablePolls.map((poll) => ({
        ...poll,
        pollState: 'NOT_VOTED',
        stats: null
      }))
    },

    async fetchVotedPolls(loadMore: boolean = false) {
      const userHash = await this.getVoterHash()
      const { data } = await apolloClient.query({
        query: GET_VOTED_POLLS_QUERY,
        variables: {
          userHash: userHash,
          pagination: {
            cursor: loadMore ? this.pageInfo?.endCursor : null,
            limit: 10
          }
        }
      })
      const connection = data.votedPolls as PollWithStatsConnection
      const newPolls = connection.edges.map((edge) => edge.node)
      this.votedPolls = loadMore ? [...this.votedPolls, ...newPolls] : newPolls
      this.pageInfo = connection.pageInfo
      this.totalCount = connection.totalCount
    },
    async votePoll(optionId: number, pollId: number) {
      try {
        const userHash = await this.getVoterHash()
        const { data, errors } = await apolloClient.mutate({
          mutation: VOTE_POLL_QUERY,
          variables: { voteInput: { voterHash: userHash, optionId, pollId } }
        })
        if (!data || errors) {
          throw Error(JSON.stringify(errors))
        }
        const pollResult = data.votePoll as VoteResponse
        const mutatePoll = (poll: AvailablePollState): AvailablePollState => {
          return { ...poll, pollState: 'VOTED', stats: pollResult.stats }
        }
        this.availablePolls = this.availablePolls.map((poll) =>
          poll.id == pollId ? mutatePoll(poll) : poll
        )
      } catch (error) {
        if (error instanceof Error) {
          this.error = error
        }
      }
    },
    async getVoterHash() {
      const userStore = useUserStore()
      // if (!await userStore.isLoggedIn) {
      //   throw new Error("user session is invalid")
      // }
      // console.log("user hash is", userStore.sessionHash, userStore.isLoggedIn)
      // const userHash = userStore.sessionHash
      // TODO: get proper user hash
      const userHash = 'TODO'
      return userHash
    }
  }
})
