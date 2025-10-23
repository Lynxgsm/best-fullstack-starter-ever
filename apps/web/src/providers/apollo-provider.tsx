'use client';

import { ApolloProvider } from '@apollo/client/react';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { createApolloClient } from '../services/apollo-service';
import { env } from '../constants/envs';

interface ApolloProviderWrapperProps {
    children: ReactNode;
}

export function ApolloProviderWrapper({ children }: ApolloProviderWrapperProps) {
    const apolloClient = useMemo(() => {
        return createApolloClient(env);
    }, []);

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