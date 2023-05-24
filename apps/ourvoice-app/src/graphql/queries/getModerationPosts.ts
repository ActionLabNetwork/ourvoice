import gql from 'graphql-tag'

export const GET_MODERATION_POSTS_QUERY = gql`
  query GetModerationPosts($limit: Int = 10) {
    moderationPosts(filter: null, pagination: { limit: $limit }) {
      edges {
        cursor
        node {
          id
          authorHash
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
            status
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
