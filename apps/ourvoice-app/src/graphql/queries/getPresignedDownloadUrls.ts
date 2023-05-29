import gql from 'graphql-tag'

export const GET_PRESIGNED_DOWNLOAD_URLS_QUERY = gql`
  query GetPresignedDownloadUrls($bucket: String!, $keys: [String!]!, $expiresIn: Int!) {
    getPresignedDownloadUrls(bucket: $bucket, keys: $keys, expiresIn: $expiresIn) {
      key
      url
    }
  }
`
