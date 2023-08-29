import { GET_CATEGORIES_QUERY } from './../graphql/queries/getCategories'
import { defineStore } from 'pinia'
import { apolloClient } from './../graphql/client/index'

export interface CategoriesState {
  data: { id: number; name: string; numPosts: number; description: string }[]
  // selectedCategories: number[]
  state: 'initial' | 'loading-initial' | 'loaded' | 'loading-more' | 'error'
  error: Error | undefined
  errorMessage: string | undefined
}

export const useCategoriesStore = defineStore('categories', {
  state: (): CategoriesState => ({
    data: [],
    // selectedCategories: [],
    state: 'initial',
    error: undefined,
    errorMessage: undefined
  }),

  actions: {
    async fetchCategories() {
      this.state = 'loading-initial'
      try {
        const { data } = await apolloClient.query({ query: GET_CATEGORIES_QUERY })
        const categories = data.categories
        if (!categories) {
          throw Error('Returned data is null')
        }
        this.data = categories.edges.map((edge) => edge.node)
        this.state = 'loaded'
      } catch (error) {
        if (error instanceof Error) {
          this.error = error
        }
        if (error) {
          this.errorMessage = 'Failed to load categories. Please try again.'
        }
        this.state = 'error'
      }
    }
  },

  getters: {
    // TODO: for compatibility when refactoring. consider removing this field later
    loading(): boolean {
      return this.state === 'loading-initial' || this.state === 'loading-more'
    }
  }
})
