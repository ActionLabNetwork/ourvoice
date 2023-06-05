import gql from 'graphql-tag'

export const GET_COMMENT_BY_ID_QUERY = gql`
  query Comment($commentId: Int!) {
    comment(id: $commentId) {
      id
      votesDown
      votesUp
    }
  }
`
