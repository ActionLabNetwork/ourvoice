import gql from 'graphql-tag'

export const GET_COMMENTS_QUERY = gql`
  query GetComments {
    comments {
      edges {
        node {
          id
          content
          createdAt
          authorHash
          authorNickname
          post {
            id
            title
          }
          parent {
            id
            content
          }
        }
      }
    }
  }
`
