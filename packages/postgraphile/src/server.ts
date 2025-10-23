import express from 'express';
import { createServer } from 'node:http';
import { pgl } from './postgraphile.js';

async function main() {
  const app = express();
  const httpServer = createServer(app);

  // Use PostGraphile as Express middleware
  app.use(pgl);

  const PORT = process.env.NODE_POSTGRAPHILE_PORT || 5002;
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphiql`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
