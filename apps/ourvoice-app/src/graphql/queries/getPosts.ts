import gql from 'graphql-tag'
import { graphql } from '../generated'

export const GET_POSTS_QUERY = graphql(`
  query GetPosts(
    $sort: PostSortingInput
    $pagination: PostPaginationInput
    $filter: PostsFilterInput
    $presignedUrlExpiresIn: Int!
  ) {
    posts(sort: $sort, pagination: $pagination, filter: $filter) {
      edges {
        node {
          id
          title
          content
          categories {
            id
            name
          }
          createdAt
          moderatedAt
          publishedAt
          published
          moderated
          authorHash
          authorNickname
          comments {
            id
            content
          }
          votesUp
          votesDown
          votes {
            authorHash
            voteType
          }
          hasContentWarning
          presignedDownloadUrls(expiresIn: $presignedUrlExpiresIn) {
            key
            url
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

export const GET_TOTAL_POST_COUNT_BY_CATEGORY_QUERY = gql`
  query GetTotalPostCount {
    posts {
      totalCount
    }
  }
`
