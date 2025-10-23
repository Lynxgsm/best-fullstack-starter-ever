import type { CodegenConfig } from '@graphql-codegen/cli';
import dotenv from 'dotenv';
dotenv.config();

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.GRAPHQL_HOST || 'http://localhost:5001/graphql',
  documents: ['graphql/**/*.gql', 'graphql/**/*.graphql'],
  ignoreNoDocuments: true,
  generates: {
    './graphql/schema.graphql': {
      plugins: ['schema-ast'],
    },
    './src/generated/graphql-apollo.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        avoidOptionals: false,
        skipTypename: false,
        withHooks: true,
        withHOC: false,
        withComponent: false,
        withRefetchFn: true,
        apolloReactHooksImportFrom: '@apollo/client/react',
        apolloReactCommonImportFrom: '@apollo/client/react',
      },
    },
  },
  hooks: {
    afterAllFileWrite: ['echo "✅ GraphQL codegen completed successfully!"'],
  },
};

export default config;
