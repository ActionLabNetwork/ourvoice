import gql from 'graphql-tag'

export const GET_COMMENTS_QUERY = gql`
  query {
    comments {
      id
      content
      createdAt
      author {
        id
        nickname
      }
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
`
