import { graphql } from '../generated'

export const GET_CATEGORIES_QUERY = graphql(`
  query GetCategories($filter: CategoriesFilterInput) {
    categories(filter: $filter) {
      edges {
        node {
          id
          name
          numPosts
          description
        }
        cursor
      }
    }
  }
`)
