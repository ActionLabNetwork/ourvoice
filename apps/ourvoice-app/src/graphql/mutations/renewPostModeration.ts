import gql from 'graphql-tag'

export const RENEW_POST_MODERATION_MUTATION = gql`
  mutation RenewPostModerationMutation($postModerationId: Int!, $moderatorHash: String!) {
    renewPostModeration(postModerationId: $postModerationId, moderatorHash: $moderatorHash) {
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
