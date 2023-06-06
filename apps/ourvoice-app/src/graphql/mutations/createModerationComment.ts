import gql from 'graphql-tag'

export const CREATE_MODERATION_COMMENT_MUTATION = gql`
  mutation CreateModerationComment($data: ModerationCommentCreateInput!) {
    createModerationComment(data: $data) {
      id
      status
    }
  }
`
