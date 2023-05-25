import gql from 'graphql-tag'

export const REJECT_MODERATION_POST_VERSION_MUTATION = gql`
  mutation RejectModerationPostVersionMutation(
    $id: Int!
    $moderatorHash: String!
    $reason: String!
  ) {
    rejectModerationPostVersion(
      id: $id
      moderatorHash: $moderatorHash
      reason: $reason
    ) {
      id
      title
      content
      categoryIds
    }
  }
`
