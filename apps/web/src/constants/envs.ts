import { z } from 'zod';

// Define the environment schema
const envSchema = z.object({
  VITE_GRAPHQL_HOST: z.string().url().default('http://localhost:5001/graphql'),
  VITE_GQL_API_KEY: z.string().optional(),
  VITE_NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  VITE_APP_NAME: z.string().default('Best Fullstack Starter'),
});

// Parse and validate environment variables
const parseEnv = () => {
  try {
    return envSchema.parse({
      VITE_GRAPHQL_HOST: import.meta.env.VITE_GRAPHQL_HOST,
      VITE_GQL_API_KEY: import.meta.env.VITE_GQL_API_KEY,
      VITE_NODE_ENV: import.meta.env.VITE_NODE_ENV,
      VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
    });
  } catch (error) {
    console.error('❌ Invalid environment variables:', error);
    throw new Error('Invalid environment variables');
  }
};

// Export validated environment variables
export const env = parseEnv();

// Export the schema for type inference
export type Env = z.infer<typeof envSchema>;
