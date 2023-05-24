import gql from 'graphql-tag'

export const CREATE_MODERATION_POST_MUTATION = gql`
  mutation CreateModerationPost($data: ModerationPostCreateInput!) {
    createModerationPost(data: $data) {
      id
      status
    }
  }
`
