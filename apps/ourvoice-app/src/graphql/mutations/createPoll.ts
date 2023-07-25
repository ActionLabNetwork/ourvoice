import { graphql } from '../generated'

export const CREATE_POLL_MUTATION = graphql(`
  mutation CreatePoll($data: PollCreateInput!) {
    createPoll(data: $data) {
      id
      active
      options {
        id
        option
      }
      postLink
      published
      question
      expiresAt
      createdAt
      weight
    }
  }
`)
