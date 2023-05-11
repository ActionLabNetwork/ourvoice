import gql from 'graphql-tag'

export const GET_CATEGORIES_QUERY = gql`
  query GetCategories {
    categories {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`
