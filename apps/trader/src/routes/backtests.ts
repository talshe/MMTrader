import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { nowISO, type BacktestResult } from '@mmtrader/core';
import { PythonClient } from '../lib/pythonClient';
import { createBacktestStore } from '../store';

const createSchema = z.object({
  datasetName: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  entryZ: z.number().min(0),
  exitZ: z.number().min(0),
  zScoreLookback: z.number().int().min(5),
  legRatio: z.number()
});

const store = createBacktestStore();
const pythonClient = new PythonClient();

const mergeResult = (prev: BacktestResult, partial: Partial<BacktestResult>): BacktestResult => ({
  ...prev,
  ...partial,
  progress: partial.progress ?? prev.progress,
  logs: partial.logs ?? prev.logs
});

export const backtestRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/backtests', async (request, reply) => {
    const payload = createSchema.parse(request.body);
    const jobRequest = store.create(payload);

    store.update(jobRequest.id, (prev) =>
      mergeResult(prev, {
        status: 'running',
        startedAt: nowISO()
      })
    );

    pythonClient
      .runBacktest(jobRequest)
      .then((result) => {
        store.update(jobRequest.id, () =>
          mergeResult(result, {
            status: 'completed',
            completedAt: nowISO()
          })
        );
      })
      .catch((error: Error) => {
        store.update(jobRequest.id, (prev) =>
          mergeResult(prev, {
            status: 'failed',
            logs: [...prev.logs, error.message],
            completedAt: nowISO()
          })
        );
      });

    reply.code(202);
    return store.get(jobRequest.id);
  });

  fastify.get('/backtests', async () => store.list());

  fastify.get<{ Params: { id: string } }>('/backtests/:id', async (request, reply) => {
    const item = store.get(request.params.id);
    if (!item) {
      reply.code(404);
      return { message: 'Backtest not found' };
    }

    return item;
  });
};

