import gql from 'graphql-tag'

export const GET_COMMENTS_QUERY = gql`
  query GetComments {
    comments {
      edges {
        node {
          id
          content
          createdAt
          authorHash
          authorNickname
          post {
            id
            title
          }
          parent {
            id
            content
          }
        }
      }
    }
  }
`

export const GET_COMMENTS_BY_POST_ID_QUERY = gql`
  query Query($pagination: CommentPaginationInput, $filter: CommentsFilterInput) {
    comments(pagination: $pagination, filter: $filter) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
        startCursor
      }
      edges {
        cursor
        node {
          content
          createdAt
          id
          parent {
            id
          }
        }
      }
    }
  }
`
