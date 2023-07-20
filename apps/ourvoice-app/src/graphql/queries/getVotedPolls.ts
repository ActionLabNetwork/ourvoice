import gql from 'graphql-tag'

export const GET_VOTED_POLLS_QUERY = gql`
  query VotedPolls($userHash: String!, $pagination: PollPaginationInput!) {
    votedPolls(userHash: $userHash, pagination: $pagination) {
      edges {
        cursor
        node {
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
      pageInfo {
        startCursor
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`
