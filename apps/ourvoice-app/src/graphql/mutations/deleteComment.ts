import gql from 'graphql-tag'
export const DELETE_COMMENT_MUTATION = gql`
  mutation DeleteComment($deleteCommentId: Int!) {
    deleteComment(id: $deleteCommentId) {
      id
      # author {
      #   id
      #   nickname
      # }
      content
      parent {
        id
        content
      }
      post {
        id
        title
      }
    }
  }
`
