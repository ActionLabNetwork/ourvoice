import gql from 'graphql-tag'

export const MODIFY_MODERATION_COMMENT_MUTATION = gql`
  mutation ModifyModerationCommentVersionMutation(
    $commentId: Int!
    $moderatorHash: String!
    $moderatorNickname: String!
    $reason: String!
    $data: ModerationCommentModifyInput!
  ) {
    modifyModerationComment(
      commentId: $commentId
      moderatorHash: $moderatorHash
      moderatorNickname: $moderatorNickname
      reason: $reason
      data: $data
    ) {
      id
      authorHash
      authorNickname
      requiredModerations
      versions {
        id
        content
        timestamp
        version
        authorHash
        authorNickname
        reason
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
