import type { BacktestResult } from '@mmtrader/core';

export interface DatasetDescriptor {
  name: string;
  description?: string;
  symbols: string[];
  frequency: string;
  lastUpdated?: string;
}

export interface CreateBacktestPayload {
  datasetName: string;
  startDate: string;
  endDate: string;
  entryZ: number;
  exitZ: number;
  zScoreLookback: number;
  legRatio: number;
}

export interface BacktestState {
  items: BacktestResult[];
  loading: boolean;
  error?: string;
  refresh: () => Promise<void>;
  createBacktest: (payload: CreateBacktestPayload) => Promise<void>;
}

