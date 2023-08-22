import { graphql } from '../generated'

export const GET_USER_POLLS_QUERY = graphql(`
  query GetUserPolls($userHash: String!) {
    votedPolls(userHash: $userHash) {
      id
      options {
        id
        option
      }
      stats {
        optionId
        proportion
      }
      question
    }
    availablePolls(userHash: $userHash) {
      id
      options {
        id
        option
      }
      question
    }
  }
  

`)
