import gql from 'graphql-tag'

export const GET_MODERATION_POSTS_QUERY = gql`
  query GetModerationPosts(
    $before: String
    $after: String
    $limit: Int = 10
    $status: ModerationPostStatus
  ) {
    moderationPosts(
      pagination: { before: $before, after: $after, limit: $limit }
      filter: { status: $status }
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
`
