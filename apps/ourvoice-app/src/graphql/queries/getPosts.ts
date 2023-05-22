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

export const GET_POSTS_BY_CATEGORIES_QUERY = gql`
  query PostsByCategories($categories: [String!]!, $limit: Int = 10, $cursor: String = null) {
    postsByCategories(
      categories: $categories
      pagination: { limit: $limit, cursor: $cursor }
      filter: null
    ) {
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
