import { graphql } from '../generated/gql'

export const GET_MODERATION_COMMENT_HISTORY_BY_ID_QUERY = graphql(`
  query GetModerationCommentHistoryById($moderationCommentHistoryId: Int!) {
    moderationCommentsHistory(id: $moderationCommentHistoryId) {
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
          hasContentWarning
          hasFromTheModeratorsTag
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
          hasContentWarning
          hasFromTheModeratorsTag
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
        hasContentWarning
        hasFromTheModeratorsTag
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
`)
