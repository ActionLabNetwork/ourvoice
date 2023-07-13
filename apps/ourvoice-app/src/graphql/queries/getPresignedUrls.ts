import { graphql } from '../generated'

export const GET_PRESIGNED_URLS_QUERY = graphql(`
  query GetPresignedUrls($keys: [String!]!, $expiresIn: Int!) {
    getPresignedUrls(keys: $keys, expiresIn: $expiresIn) {
      key
      url
    }
  }
`)
