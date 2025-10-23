'use client';

import { ApolloProvider } from '@apollo/client/react';
import { ReactNode, useMemo } from 'react';
import { createApolloClient } from '@/services/apollo-service';
import { useEnv } from '@/hooks/use-env';

interface ApolloProviderWrapperProps {
  children: ReactNode;
}

export function ApolloProviderWrapper({ children }: ApolloProviderWrapperProps) {
  const { GRAPHQL_HOST, GQL_API_KEY, NODE_ENV } = useEnv();

  const apolloClient = useMemo(() => {
    return createApolloClient({
      GRAPHQL_HOST,
      GQL_API_KEY,
      NODE_ENV,
    });
  }, [GRAPHQL_HOST, GQL_API_KEY, NODE_ENV]);

  if (!apolloClient) {
    return null;
  }

  return (
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  );
}

export default ApolloProviderWrapper;