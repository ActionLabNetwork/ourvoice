import { graphql } from '../generated'

export const GET_PRESIGNED_DOWNLOAD_URLS_QUERY = graphql(`
  query GetPresignedDownloadUrls($keys: [String!]!, $expiresIn: Int!) {
    getPresignedDownloadUrls(keys: $keys, expiresIn: $expiresIn) {
      key
      url
    }
  }
`)
