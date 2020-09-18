import ApolloClient from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import fetch from 'unfetch';

const endpoints = {
  simple: 'https://api.thegraph.com/subgraphs/name/quilldata/kleros',
  ws: 'wss://api.thegraph.com/subgraphs/name/quilldata/kleros'
}

export const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: endpoints.simple, fetch: fetch }),
  cache: new InMemoryCache()
})
