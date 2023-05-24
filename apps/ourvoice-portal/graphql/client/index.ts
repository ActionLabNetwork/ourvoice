import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client/core'

export function createApolloClient(host: string) {
  const httpLink = createHttpLink({
    uri: `${host}/graphql`,
  })
  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  })
}
