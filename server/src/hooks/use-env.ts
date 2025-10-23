export const useEnv = () => {
  return {
    GRAPHQL_HOST: process.env.GRAPHQL_HOST || 'http://localhost:5000/graphql',
    GQL_API_KEY: process.env.GQL_API_KEY,
    NODE_ENV: process.env.NODE_ENV || 'development',
  };
};
