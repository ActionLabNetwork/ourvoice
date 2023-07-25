import { graphql } from '../generated'

export const GET_AVAILABLE_POLLS_QUERY = graphql(`
  query GetAvailablePolls($userHash: String!) {
    availablePolls(userHash: $userHash) {
      active
      id
      options {
        id
        option
      }
      postLink
      published
      question
      weight
      createdAt
      expiresAt
    }
  }
`)
