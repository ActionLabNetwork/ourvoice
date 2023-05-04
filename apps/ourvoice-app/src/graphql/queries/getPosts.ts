import gql from 'graphql-tag'

export const GET_POSTS_QUERY = gql`
  query getPosts {
    posts {
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
    }
  }
`
