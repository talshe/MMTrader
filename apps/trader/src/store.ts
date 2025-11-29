import { randomUUID } from 'crypto';
import { createEmptyResult, type BacktestRequest, type BacktestResult } from '@mmtrader/core';
import type { BacktestStore, CreateBacktestBody } from './types';

const buildRequest = (body: CreateBacktestBody): BacktestRequest => ({
  id: randomUUID(),
  datasetName: body.datasetName,
  legs: [
    { symbol: 'YM', multiplier: 1 },
    { symbol: 'ES', multiplier: body.legRatio }
  ],
  startDate: body.startDate,
  endDate: body.endDate,
  resolution: '1s',
  parameters: {
    entryZ: body.entryZ,
    exitZ: body.exitZ,
    lookback: body.zScoreLookback
  }
});

export const createBacktestStore = (): BacktestStore => {
  const jobs = new Map<string, BacktestResult>();

  return {
    create(body: CreateBacktestBody) {
      const request = buildRequest(body);
      jobs.set(request.id, createEmptyResult(request));
      return request;
    },
    update(id: string, mutator: (prev: BacktestResult) => BacktestResult) {
      const existing = jobs.get(id);
      if (!existing) {
        return;
      }

      jobs.set(id, mutator(existing));
    },
    list() {
      return Array.from(jobs.values()).sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1));
    },
    get(id: string) {
      return jobs.get(id);
    }
  };
};

