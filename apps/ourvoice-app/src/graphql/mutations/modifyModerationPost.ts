import gql from 'graphql-tag'

export const MODIFY_MODERATION_POST_MUTATION = gql`
  mutation ModifyModerationPostVersionMutation(
    $postId: Int!
    $moderatorHash: String!
    $moderatorNickname: String!
    $reason: String!
    $data: ModerationPostModifyInput!
    $hasContentWarning: Boolean!
  ) {
    modifyModerationPost(
      postId: $postId
      moderatorHash: $moderatorHash
      moderatorNickname: $moderatorNickname
      reason: $reason
      data: $data
      hasContentWarning: $hasContentWarning
    ) {
      id
      authorHash
      authorNickname
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
        authorNickname
        latest
        moderations {
          id
          decision
          moderatorHash
          moderatorNickname
          reason
          timestamp
        }
      }
    }
  }
`
