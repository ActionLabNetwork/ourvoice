import gql from 'graphql-tag'

export const GET_CATEGORIES_QUERY = gql`
  query GetCategories($filter: CategoriesFilterInput) {
    categories(filter: $filter) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`
