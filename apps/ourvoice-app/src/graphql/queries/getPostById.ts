import gql from 'graphql-tag'
import { graphql } from '../generated'

export const GET_POST_BY_ID_QUERY = graphql(`
  query Post($postId: Int!, $presignedUrlExpiresIn: Int!) {
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
      hasFromTheModeratorsTag
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

export const GET_LATEST_POST_QUERY = gql(`
  query LatestPost($authorHash: String!) {
    latestModerationPost(authorHash: $authorHash) {
      id
    }
  }
`)
