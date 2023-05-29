import gql from 'graphql-tag'

export const GET_MODERATION_POST_BY_ID_QUERY = gql`
  query GetModerationPostsById($moderationPostId: Int!) {
    moderationPost(id: $moderationPostId) {
      id
      authorHash
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
        reason
        latest
        status
        moderations {
          id
          decision
          moderatorHash
          reason
          timestamp
        }
      }
    }
  }
`
