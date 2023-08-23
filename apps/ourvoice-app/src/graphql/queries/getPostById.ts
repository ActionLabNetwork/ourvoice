import { graphql } from '../generated'

export const GET_POST_BY_ID_QUERY = graphql(`
  query Post(
    $postId: Int!
    $presignedUrlExpiresIn: Int!
  ) {
    post(id: $postId) {
      authorHash
      authorNickname
      categories {
        id
        name
      }
      comments {
        id
        content
      }
      content
      createdAt
      disabledAt
      id
      moderated
      moderatedAt
      published
      publishedAt
      title
      votesDown
      votesUp
      hasContentWarning
      votes {
        authorHash
        voteType
      }
      presignedDownloadUrls(expiresIn: $presignedUrlExpiresIn) {
        key
        url
      }
    }
  }
`)
