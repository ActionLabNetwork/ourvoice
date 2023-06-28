import gql from 'graphql-tag'

export const GET_MODERATION_POST_BY_ID_QUERY = gql`
  query GetModerationPostsById($moderationPostId: Int!) {
    moderationPost(id: $moderationPostId) {
      id
      authorHash
      authorNickname
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
