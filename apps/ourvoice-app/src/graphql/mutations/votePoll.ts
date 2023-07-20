import { graphql } from '../generated'

export const VOTE_POLL_QUERY = graphql(`
  mutation VotePoll($voteInput: VoteInput) {
    votePoll(voteInput: $voteInput) {
      optionId
      pollId
      stats {
        optionId
        proportion
      }
    }
  }
`)
