import { GET_CATEGORIES_QUERY } from './../graphql/queries/getCategories'
import { defineStore } from 'pinia'
import { apolloClient } from './../graphql/client/index'


export interface CategoriesState {
  data: { id: number; name: string; numPosts: number }[]
  // selectedCategories: number[]
  loading: boolean
  error: Error | undefined
  errorMessage: string | undefined
}

export const useCategoriesStore = defineStore('categories', {
  state: (): CategoriesState => ({
    data: [],
    // selectedCategories: [],
    loading: false,
    error: undefined,
    errorMessage: undefined
  }),

  actions: {
    async fetchCategories() {
      try {
        const { data } = await apolloClient.query({ query: GET_CATEGORIES_QUERY })
        const categories = data.categories
        if (!categories) {
          throw Error('Returned data is null')
        }
        this.data = categories.edges.map((edge) => edge.node)
      } catch (error) {
        if (error instanceof Error) {
          this.error = error
        }
        if (error) {
          this.errorMessage = 'Failed to load categories. Please try again.'
        }
      }
    }
  }
})
