import gql from 'graphql-tag'

export const RENEW_COMMENT_MODERATION_MUTATION = gql`
  mutation RenewCommentModerationMutation($commentModerationId: Int!, $moderatorHash: String!) {
    renewCommentModeration(commentModerationId: $commentModerationId, moderatorHash: $moderatorHash) {
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
