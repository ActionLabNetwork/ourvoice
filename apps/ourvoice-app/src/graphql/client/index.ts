import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'

// Set up GraphQL client
const httpLink = createHttpLink({
  uri: `${import.meta.env.VITE_APP_API_URL}/graphql` || 'http://localhost:3000/graphql'
})

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})
