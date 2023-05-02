import gql from 'graphql-tag'

export const GET_POSTS_QUERY = gql`
  query {
    posts {
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
      votesUp
      votesDown
    }
  }
`
