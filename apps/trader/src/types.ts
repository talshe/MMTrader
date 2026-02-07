import type {
  BacktestRequest,
  BacktestResult,
  CreateBacktestPayload,
  UpdateBacktestMetadataPayload
} from '@mmtrader/core';

export type { CreateBacktestPayload, UpdateBacktestMetadataPayload };

export interface BacktestStore {
  create(body: CreateBacktestPayload): Promise<BacktestRequest>;
  update(id: string, mutator: (prev: BacktestResult) => BacktestResult): Promise<void>;
  list(): Promise<BacktestResult[]>;
  get(id: string): Promise<BacktestResult | undefined>;
  updateMetadata(id: string, body: UpdateBacktestMetadataPayload): Promise<void>;
  delete(id: string): Promise<void>;
  getStatus(id: string): Promise<string | undefined>;
}
