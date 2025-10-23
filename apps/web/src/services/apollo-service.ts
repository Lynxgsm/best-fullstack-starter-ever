import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import type { Env } from '@/constants/envs';

export const createApolloClient = (env: Env) => {
  const { VITE_GRAPHQL_HOST, VITE_GQL_API_KEY, VITE_NODE_ENV } = env;

  console.log('🔗 Apollo Client connecting to:', VITE_GRAPHQL_HOST);

  const httpLink = new HttpLink({
    uri: VITE_GRAPHQL_HOST,
    headers: VITE_GQL_API_KEY
      ? {
          Authorization: `Bearer ${VITE_GQL_API_KEY}`,
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
    ssrMode: VITE_NODE_ENV === 'production',
  });
};
