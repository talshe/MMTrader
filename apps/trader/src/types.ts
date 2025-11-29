import type { BacktestRequest, BacktestResult } from '@mmtrader/core';

export interface CreateBacktestBody {
  datasetName: string;
  startDate: string;
  endDate: string;
  entryZ: number;
  exitZ: number;
  zScoreLookback: number;
  legRatio: number;
}

export interface BacktestStore {
  create(body: CreateBacktestBody): BacktestRequest;
  update(id: string, mutator: (prev: BacktestResult) => BacktestResult): void;
  list(): BacktestResult[];
  get(id: string): BacktestResult | undefined;
}

