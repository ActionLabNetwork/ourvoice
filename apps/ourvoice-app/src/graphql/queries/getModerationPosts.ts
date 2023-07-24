import gql from 'graphql-tag'
import { graphql } from '@/graphql/generated/gql'

export const GET_MODERATION_POSTS_QUERY = graphql(`
  query GetModerationPosts(
    $before: String
    $after: String
    $limit: Int = 10
    $status: ModerationPostStatus
    $archived: Boolean
    $published: Boolean
  ) {
    moderationPosts(
      pagination: { before: $before, after: $after, limit: $limit }
      filter: { status: $status, archived: $archived, published: $published }
    ) {
      edges {
        cursor
        node {
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
            authorHash
            authorNickname
            timestamp
            version
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
      totalCount
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }
`)
