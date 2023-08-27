// import gql from 'graphql-tag'
import { graphql } from '../generated'
export const GET_COMMENTS_QUERY = graphql(`
  query GetComments($filter: CommentsFilterInput, $pagination: CommentPaginationInput) {
    comments(filter: $filter, pagination: $pagination) {
      edges {
        node {
          id
          content
          votesDown
          votesUp
          votes {
            authorHash
            voteType
          }
          hasContentWarning
          hasFromTheModeratorsTag
          moderated
          published
          createdAt
          moderatedAt
          publishedAt
          disabledAt
          authorHash
          authorNickname
          post {
            id
          }
          parent {
            id
            authorNickname
          }
        }
      }
      totalCount
      pageInfo {
        endCursor
        hasNextPage
        startCursor
      }
    }
  }
`)
