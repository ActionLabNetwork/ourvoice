import gql from 'graphql-tag'

export const GET_MODERATION_COMMENTS_QUERY = gql`
  query GetModerationComments($cursor: String, $limit: Int = 10) {
    moderationComments(filter: null, pagination: { cursor: $cursor, limit: $limit }) {
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
          }
        }
      }
      totalCount
      pageInfo {
        startCursor
        endCursor
        hasNextPage
      }
    }
  }
`
