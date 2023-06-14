import gql from 'graphql-tag'

export const GET_POST_BY_ID_QUERY = gql`
  query Post($postId: Int!) {
    post(id: $postId) {
      id
      title
      content
      files
      createdAt
      moderatedAt
      moderated
      published
      publishedAt
      authorHash
      authorNickname
      votesDown
      votesUp
    }
  }
`
