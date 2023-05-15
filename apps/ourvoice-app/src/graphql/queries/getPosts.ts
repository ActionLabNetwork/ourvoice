import gql from 'graphql-tag'

export const GET_POSTS_QUERY = gql`
  query GetPosts($limit: Int = 10, $cursor: String = null) {
    posts(pagination: { limit: $limit, cursor: $cursor }, filter: null) {
      edges {
        node {
          id
          title
          content
          categories {
            id
            name
          }
          createdAt
          authorHash
          authorNickname
          comments {
            id
            content
          }
          votesUp
          votesDown
        }
      }
      totalCount
      pageInfo {
        endCursor
        hasNextPage
        startCursor
      }
    }
  }
`
