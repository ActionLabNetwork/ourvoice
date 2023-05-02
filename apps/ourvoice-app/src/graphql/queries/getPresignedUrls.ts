import gql from 'graphql-tag'

export const GET_PRESIGNED_URLS_QUERY = gql`
  query GetPresignedUrls($bucket: String!, $keys: [String!]!, $expiresIn: Int!) {
    getPresignedUrls(bucket: $bucket, keys: $keys, expiresIn: $expiresIn) {
      key
      url
    }
  }
`
