import gql from 'graphql-tag'

export const GET_MODERATION_COMMENT_BY_ID_QUERY = gql`
  query GetModerationCommentById($moderationCommentId: Int!) {
    moderationComment(id: $moderationCommentId) {
      id
      authorHash
      authorNickname
      requiredModerations
      status
      post {
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
      parent {
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
        }
      }
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
