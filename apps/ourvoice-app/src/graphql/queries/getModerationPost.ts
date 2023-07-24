import { graphql } from '@/graphql/generated/gql'
import gql from 'graphql-tag'

export const GET_MODERATION_POST_BY_ID_QUERY = graphql(`
  query GetModerationPostById($moderationPostId: Int!) {
    moderationPost(id: $moderationPostId) {
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
  }
`)
