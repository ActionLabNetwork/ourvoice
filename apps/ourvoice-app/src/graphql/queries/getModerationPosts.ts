import gql from 'graphql-tag'

export const GET_MODERATION_POSTS_QUERY = gql`
  query GetModerationPosts($cursor: String, $limit: Int = 10) {
    moderationPosts(filter: null, pagination: { cursor: $cursor, limit: $limit }) {
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
      }
    }
  }
`
