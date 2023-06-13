import gql from 'graphql-tag'

export const APPROVE_MODERATION_COMMENT_VERSION_MUTATION = gql`
  mutation Mutation(
    $id: Int!
    $moderatorHash: String!
    $moderatorNickname: String!
    $reason: String
  ) {
    approveModerationCommentVersion(
      id: $id
      moderatorHash: $moderatorHash
      moderatorNickname: $moderatorNickname
      reason: $reason
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
