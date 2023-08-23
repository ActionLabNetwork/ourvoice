import gql from 'graphql-tag'

export const GET_MODERATION_COMMENTS_QUERY = gql`
  query GetModerationComments(
    $before: String
    $after: String
    $limit: Int = 10
    $status: ModerationCommentStatus
    $published: Boolean
    $archived: Boolean
  ) {
    moderationComments(
      pagination: { before: $before, after: $after, limit: $limit }
      filter: { status: $status, published: $published, archived: $archived }
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
            content
            authorHash
            authorNickname
            timestamp
            version
            latest
            hasContentWarning
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
`
