import { GET_CATEGORIES_QUERY } from './../graphql/queries/getCategories'
import { defineStore } from 'pinia'
import { useQuery } from '@vue/apollo-composable'

interface Category {
  id: number
  name: string
}

interface Edge {
  node: Category
}

interface Data {
  categories: {
    edges: Edge[]
  }
}

interface Result {
  data: Data
  loading: boolean
}

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
      const { onResult, onError } = useQuery(GET_CATEGORIES_QUERY)

      onResult(({ data, loading }: Result) => {
        const extractCategories = ({ node: { id, name } }: Edge): Category => ({ id, name })

        this.data = data.categories.edges.map(extractCategories)
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
