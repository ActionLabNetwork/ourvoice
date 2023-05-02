import { defineStore } from 'pinia'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export interface CategoriesState {
  data: { id: number; name: string }[]
  loading: boolean
  error: Error | undefined
  errorMessage: string | undefined
}

export const useCategoriesStore = defineStore('categories', {
  state: (): CategoriesState => ({
    data: [],
    loading: false,
    error: undefined,
    errorMessage: undefined
  }),

  actions: {
    async fetchCategories() {
      const { onResult, onError } = useQuery(
        gql`
          query {
            categories {
              id
              name
            }
          }
        `
      )

      onResult(({ data, loading }) => {
        this.data = data.categories
        this.loading = loading
      })

      onError((error) => {
        this.error = error
        if (error) {
          this.errorMessage = 'Failed to load categories. Please try again.'
        }
      })
    }
  }
})
