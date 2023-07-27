import { apolloClient } from '@/graphql/client'
import {
  GetUserPollsDocument,
  type GetUserPollsQuery,
  type PollPageInfo,
  type PollWithStats,
  type VoteResponse
} from '@/graphql/generated/graphql'
import { VOTE_POLL_QUERY } from '@/graphql/mutations/votePoll'
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { GET_USER_POLLS_QUERY } from '@/graphql/queries/getUserPolls'

export type PollWithStatsSub = GetUserPollsQuery['votedPolls'][number]
export interface AvailablePollState extends PollWithStatsSub {
  pollState: 'NOT_VOTED' | 'NO_RESULT' | 'VOTED'
}

export interface PollState {
  availablePolls: AvailablePollState[]
  votedPolls: PollWithStatsSub[]
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
        const userHash = await this.getUserHash()
        const { data, errors } = await apolloClient.query({
          query: GET_USER_POLLS_QUERY,
          variables: {userHash}
        })
        this.availablePolls = data.availablePolls.map((poll) => ({
          ...poll,
          pollState: 'NOT_VOTED',
          stats: null
        }))
        this.votedPolls = data.votedPolls
        console.log(this.votedPolls)
        this.state = 'loaded'
      } catch (e) {
        console.error(e)
        if (e instanceof Error) {
          this.error = e
        }
        this.state = 'error'
      }
    },
    async votePoll(optionId: number, pollId: number) {
      try {
        const userHash = await this.getUserHash()
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
    async getUserHash() {
      const userStore = useUserStore()
      if (!(await userStore.isLoggedIn)) {
        throw new Error('user session is invalid')
      }
      return userStore.sessionHash
    }
  }
})
