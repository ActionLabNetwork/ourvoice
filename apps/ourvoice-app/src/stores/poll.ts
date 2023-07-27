import { apolloClient } from '@/graphql/client'
import type {
  PollPageInfo,
  PollWithStats,
  VoteResponse
} from '@/graphql/generated/graphql'
import { VOTE_POLL_QUERY } from '@/graphql/mutations/votePoll'
import { GET_AVAILABLE_POLLS_QUERY } from '@/graphql/queries/getAvailablePolls'
import { GET_VOTED_POLLS_QUERY } from '@/graphql/queries/getVotedPolls'
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export interface AvailablePollState extends PollWithStats {
  pollState: 'NOT_VOTED' | 'NO_RESULT' | 'VOTED'
}

export interface PollState {
  availablePolls: AvailablePollState[]
  votedPolls: PollWithStats[]
  pageInfo: PollPageInfo | undefined | null
  totalCount: number | undefined | null
  state: 'initial' | 'loading-initial' | 'loaded' | 'error'
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

    async fetchVotedPolls() {
      const userHash = await this.getVoterHash()
      const { data } = await apolloClient.query({
        query: GET_VOTED_POLLS_QUERY,
        variables: {
          userHash: userHash
        }
      })
      this.votedPolls = data.votedPolls
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
      if (!(await userStore.isLoggedIn)) {
        throw new Error('user session is invalid')
      }
      return userStore.sessionHash
    }
  }
})
