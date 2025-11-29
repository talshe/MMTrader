import Fastify from 'fastify';
import pino from 'pino';
import { backtestRoutes } from './routes/backtests';
import { datasetRoutes } from './routes/datasets';
import { liveRoutes } from './routes/live';

const PORT = Number(process.env.PORT ?? 4000);

export const buildServer = () => {
  const logger = pino({ level: process.env.LOG_LEVEL ?? 'info' });
  const server = Fastify({ logger });

  server.get('/health', async () => ({ status: 'ok' }));

  server.register(datasetRoutes, { prefix: '/api' });
  server.register(backtestRoutes, { prefix: '/api' });
  server.register(liveRoutes, { prefix: '/api' });

  return server;
};

export const start = async () => {
  const server = buildServer();
  try {
    await server.listen({ port: PORT, host: '0.0.0.0' });
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};

if (require.main === module) {
  start();
}

