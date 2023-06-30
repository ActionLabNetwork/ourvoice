import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import config from '@/config'

// Set up GraphQL client
const httpLink = createHttpLink({
  uri: `${config.apiURL}/graphql` || 'http://localhost:3000/graphql'
})

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})
