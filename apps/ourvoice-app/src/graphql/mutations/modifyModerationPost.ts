import gql from 'graphql-tag'

export const MODIFY_MODERATION_POST_MUTATION = gql`
  mutation ModifyModerationPostVersionMutation(
    $postId: Int!
    $moderatorHash: String!
    $reason: String!
    $data: ModerationPostModifyInput!
  ) {
    modifyModerationPost(
      postId: $postId
      moderatorHash: $moderatorHash
      reason: $reason
      data: $data
    ) {
      id
      authorHash
      requiredModerations
      versions {
        id
        title
        content
        categoryIds
        files
        timestamp
        version
        authorHash
        reason
        latest
        moderations {
          id
          decision
          moderatorHash
          reason
          timestamp
        }
      }
    }
  }
`
