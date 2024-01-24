import { gql } from 'graphql-tag'

export const GET_COMMENT_BY_ID_QUERY = gql`
  query Comment($commentId: Int!) {
    comment(id: $commentId) {
      id
      votesDown
      votesUp
    }
  }
`

export const GET_LATEST_COMMENT_QUERY = gql`
  query LatestComment($authorHash: String!) {
    latestModerationComment(authorHash: $authorHash) {
      id
    }
  }
`
