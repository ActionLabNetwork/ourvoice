import { ApolloClient, createHttpLink, InMemoryCache, type StoreObject } from '@apollo/client/core'
import config from '@/config'

// Set up GraphQL client
const httpLink = createHttpLink({
  uri: `${config.apiURL}/graphql` || 'http://localhost:3000/graphql'
})

 const apolloClientCache = new InMemoryCache()
// Create the apollo client
export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: apolloClientCache
})


export function evictItem<T extends StoreObject>(o: T, fieldName?: keyof T & string) {
  const cacheId = apolloClientCache.identify(o)
  // If the object cannot be identified, reset the whole cache to prevent any inconsistency.
  if (!cacheId) {
    console.log(`Failed to evict cache for object: ${o}, clearing entire cache`)
    apolloClient.resetStore()
    return
  }
  apolloClientCache.evict({id: cacheId, fieldName})
}
