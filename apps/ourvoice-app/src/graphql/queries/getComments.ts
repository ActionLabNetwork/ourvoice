import gql from 'graphql-tag'

export const GET_COMMENTS_QUERY = gql`
  query GetComments($filter: CommentsFilterInput, $pagination: CommentPaginationInput) {
    comments(filter: $filter, pagination: $pagination) {
      edges {
        node {
          id
          content
          votesDown
          votesUp
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
`
