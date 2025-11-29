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

const updateMetadataSchema = z.object({
  datasetName: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  entryZ: z.number().min(0).optional(),
  exitZ: z.number().min(0).optional(),
  zScoreLookback: z.number().int().min(5).optional(),
  legRatio: z.number().optional()
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided for update' }
);

const store = createBacktestStore();
const pythonClient = new PythonClient();

// Map to track AbortControllers for running backtests
const abortControllers = new Map<string, AbortController>();

const mergeResult = (prev: BacktestResult, partial: Partial<BacktestResult>): BacktestResult => ({
  ...prev,
  ...partial,
  progress: partial.progress ?? prev.progress,
  logs: partial.logs ?? prev.logs
});

export const backtestRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/backtests', async (request, reply) => {
    const payload = createSchema.parse(request.body);
    const jobRequest = await store.create(payload);

    await store.update(jobRequest.id, (prev) =>
      mergeResult(prev, {
        status: 'running',
        startedAt: nowISO()
      })
    );

    // Create AbortController for this backtest
    const abortController = new AbortController();
    abortControllers.set(jobRequest.id, abortController);

    pythonClient
      .runBacktest(jobRequest, abortController.signal)
      .then(async (result) => {
        abortControllers.delete(jobRequest.id);
        await store.update(jobRequest.id, () =>
          mergeResult(result, {
            status: 'completed',
            completedAt: nowISO()
          })
        );
      })
      .catch(async (error: Error) => {
        abortControllers.delete(jobRequest.id);
        
        // Check if it was aborted
        if (error.name === 'AbortError' || abortController.signal.aborted) {
          await store.update(jobRequest.id, (prev) =>
            mergeResult(prev, {
              status: 'cancelled',
              completedAt: nowISO(),
              logs: [...prev.logs, 'Backtest was cancelled']
            })
          );
        } else {
          await store.update(jobRequest.id, (prev) =>
            mergeResult(prev, {
              status: 'failed',
              logs: [...prev.logs, error.message],
              completedAt: nowISO()
            })
          );
        }
      });

    reply.code(202);
    return await store.get(jobRequest.id);
  });

  fastify.get('/backtests', async () => {
    return await store.list();
  });

  fastify.get<{ Params: { id: string } }>('/backtests/:id', async (request, reply) => {
    const item = await store.get(request.params.id);
    if (!item) {
      reply.code(404);
      return { message: 'Backtest not found' };
    }

    return item;
  });

  fastify.patch<{ Params: { id: string } }>('/backtests/:id', async (request, reply) => {
    const { id } = request.params;
    const existing = await store.get(id);
    
    if (!existing) {
      reply.code(404);
      return { message: 'Backtest not found' };
    }

    // Don't allow updating if backtest is running
    if (existing.status === 'running') {
      reply.code(400);
      return { message: 'Cannot update a running backtest' };
    }

    const payload = updateMetadataSchema.parse(request.body);
    
    try {
      await store.updateMetadata(id, payload);
      return await store.get(id);
    } catch (error) {
      reply.code(404);
      return { message: (error as Error).message };
    }
  });

  fastify.delete<{ Params: { id: string } }>('/backtests/:id', async (request, reply) => {
    const { id } = request.params;
    const existing = await store.get(id);
    
    if (!existing) {
      reply.code(404);
      return { message: 'Backtest not found' };
    }

    // Cancel if running
    if (existing.status === 'running') {
      const abortController = abortControllers.get(id);
      if (abortController) {
        abortController.abort();
        abortControllers.delete(id);
        
        // Update status to cancelled before deleting
        await store.update(id, (prev) =>
          mergeResult(prev, {
            status: 'cancelled',
            completedAt: nowISO(),
            logs: [...prev.logs, 'Backtest was cancelled and deleted']
          })
        );
      }
    }

    try {
      await store.delete(id);
      reply.code(204);
      return;
    } catch (error) {
      reply.code(404);
      return { message: (error as Error).message };
    }
  });
};
