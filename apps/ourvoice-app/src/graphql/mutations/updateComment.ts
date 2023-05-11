import gql from 'graphql-tag'

export const UPDATE_COMMENT_MUTATION = gql`
  mutation UpdateComment($updateCommentId: Int!, $data: CommentUpdateInput!) {
    updateComment(id: $updateCommentId, data: $data) {
      id
      content
    }
  }
`
