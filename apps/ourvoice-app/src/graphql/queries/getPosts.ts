import gql from 'graphql-tag'

export const GET_POSTS_QUERY = gql`
  query GetPosts($limit: Int = 10) {
    posts(pagination: { limit: $limit }, filter: null) {
      edges {
        node {
          id
          title
          content
          createdAt
          author {
            id
            nickname
          }
          categories {
            id
            name
          }
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
