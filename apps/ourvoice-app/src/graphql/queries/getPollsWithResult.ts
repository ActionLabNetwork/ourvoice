import { graphql } from '../generated'

export const GET_POLLS_WITH_RESULT_QUERY = graphql(`
  query GetPollsWithResult(
    $moderatorHash: String!
    $filter: PollFilterInput!
    $pagination: PollPaginationInput!
  ) {
    pollsWithResult(moderatorHash: $moderatorHash, filter: $filter, pagination: $pagination) {
      totalCount
      pageInfo {
        startCursor
        endCursor
        hasNextPage
      }
      edges {
        node {
          id
          question
          published
          active
          postLink
          weight
          createdAt
          expiresAt
          options {
            id
            option
            numVotes
          }
        }
        cursor
      }
    }
  }
`)
