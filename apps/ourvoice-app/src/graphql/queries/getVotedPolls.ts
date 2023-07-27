import { graphql } from '../generated'

export const GET_VOTED_POLLS_QUERY = graphql(`
  query VotedPolls($userHash: String!) {
    votedPolls(userHash: $userHash) {
      active
      createdAt
      expiresAt
      id
      options {
        id
        option
      }
      postLink
      published
      stats {
        optionId
        proportion
      }
      question
      weight
    }
  }
`)
