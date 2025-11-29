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

export interface UpdateBacktestMetadataBody {
  datasetName?: string;
  startDate?: string;
  endDate?: string;
  entryZ?: number;
  exitZ?: number;
  zScoreLookback?: number;
  legRatio?: number;
}

export interface BacktestStore {
  create(body: CreateBacktestBody): Promise<BacktestRequest>;
  update(id: string, mutator: (prev: BacktestResult) => BacktestResult): Promise<void>;
  list(): Promise<BacktestResult[]>;
  get(id: string): Promise<BacktestResult | undefined>;
  updateMetadata(id: string, body: UpdateBacktestMetadataBody): Promise<void>;
  delete(id: string): Promise<void>;
  getStatus(id: string): Promise<string | undefined>;
}
