import { graphql } from '../generated'

export const REMOVE_POLL_MUTATION = graphql(`
  mutation RemovePoll($pollId: Int!) {
    removePoll(pollId: $pollId)
  }
`)
