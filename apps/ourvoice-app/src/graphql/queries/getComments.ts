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
      edges {
        cursor
        node {
          author {
            id
            nickname
          }
          content
          createdAt
          disabledAt
          id
          moderated
          moderatedAt
          parent {
            id
            author {
              id
              nickname
            }
          }
          post {
            id
          }
          published
          publishedAt
          votesDown
          votesUp
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        startCursor
      }
      totalCount
    }
  }
`
