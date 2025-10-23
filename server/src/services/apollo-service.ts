import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

interface ApolloClientConfig {
  GRAPHQL_HOST: string;
  GQL_API_KEY?: string;
  NODE_ENV: string;
}

export const createApolloClient = (env: ApolloClientConfig) => {
  const { GRAPHQL_HOST, GQL_API_KEY, NODE_ENV } = env;

  const httpLink = new HttpLink({
    uri: GRAPHQL_HOST || 'http://localhost:5000/graphql',
    credentials: 'include',
    headers: GQL_API_KEY
      ? {
          Authorization: `Bearer ${GQL_API_KEY}`,
        }
      : {},
  });

  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
    // Enable SSR mode for server-side rendering
    ssrMode: NODE_ENV === 'production',
  });
};
