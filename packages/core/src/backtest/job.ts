import { BacktestRequest, BacktestResult } from './types';

export type BacktestJob = {
  request: BacktestRequest;
  result: BacktestResult;
};

export const createEmptyResult = (request: BacktestRequest): BacktestResult => ({
  id: request.id,
  datasetName: request.datasetName,
  startedAt: new Date().toISOString(),
  status: 'queued',
  progress: [],
  logs: []
});

