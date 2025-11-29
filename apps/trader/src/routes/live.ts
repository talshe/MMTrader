import type { FastifyPluginAsync } from 'fastify';
import { listAdapters } from '../adapters/registry';

export const liveRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/live/adapters', async () => listAdapters().map((adapter) => adapter.venue));
};

