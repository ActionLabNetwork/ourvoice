import gql from 'graphql-tag'

export const REJECT_MODERATION_POST_VERSION_MUTATION = gql`
  mutation RejectModerationPostVersionMutation(
    $id: Int!
    $moderatorHash: String!
    $moderatorNickname: String!
    $reason: String!
  ) {
    rejectModerationPostVersion(id: $id, moderatorHash: $moderatorHash, moderatorNickname: $moderatorNickname, reason: $reason) {
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
