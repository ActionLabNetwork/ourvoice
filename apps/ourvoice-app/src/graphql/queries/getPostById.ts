import { graphql } from '../generated'

export const GET_POST_BY_ID_QUERY = graphql(`
  query Post($postId: Int!) {
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
      files
      id
      moderated
      moderatedAt
      published
      publishedAt
      title
      votesDown
      votesUp
      votes {
        authorHash
        voteType
      }
    }
  }
`)
