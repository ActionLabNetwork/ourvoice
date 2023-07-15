import gql from 'graphql-tag'

export const APPROVE_MODERATION_POST_VERSION_MUTATION = gql`
  mutation ApproveModerationPostVersion($id: Int!, $moderatorHash: String!, $moderatorNickname: String!, $reason: String) {
    approveModerationPostVersion(id: $id, moderatorHash: $moderatorHash, moderatorNickname: $moderatorNickname, reason: $reason) {
      id
      authorHash
      authorNickname
      requiredModerations
      status
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
