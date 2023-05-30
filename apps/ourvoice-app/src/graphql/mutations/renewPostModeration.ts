import gql from 'graphql-tag'

export const RENEW_POST_MODERATION_MUTATION = gql`
  mutation RenewPostModerationMutation($postModerationId: Int!, $moderatorHash: String!) {
    renewPostModeration(postModerationId: $postModerationId, moderatorHash: $moderatorHash) {
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
