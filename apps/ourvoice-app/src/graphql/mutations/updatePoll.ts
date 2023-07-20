import { graphql } from '../generated'

export const UPDATE_POLL_MUTATION = graphql(`
  mutation UpdatePoll($pollId: Int!, $data: PollUpdateInput!) {
    updatePoll(pollId: $pollId, data: $data) {
      id
      question
      options {
        id
        option
      }
      active
      createdAt
      expiresAt
      postLink
      published
      weight
    }
  }
`)
