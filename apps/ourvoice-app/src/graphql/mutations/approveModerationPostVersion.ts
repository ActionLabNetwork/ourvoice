import gql from 'graphql-tag'

export const APPROVE_MODERATION_POST_VERSION_MUTATION = gql`
  mutation Mutation($id: Int!, $moderatorHash: String!, $reason: String) {
    approveModerationPostVersion(id: $id, moderatorHash: $moderatorHash, reason: $reason) {
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
