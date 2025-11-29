export type Resolution = '1s' | '1m' | '5m';

export interface SpreadLeg {
  symbol: string;
  multiplier: number;
}

export interface BacktestRequest {
  id: string;
  datasetName: string;
  legs: [SpreadLeg, SpreadLeg];
  startDate: string;
  endDate: string;
  resolution: Resolution;
  parameters: Record<string, number | string>;
}

export interface BacktestProgressPoint {
  timestamp: string;
  value: number;
}

export interface BacktestResultSummary {
  totalPnL: number;
  sharpe: number;
  maxDrawdown: number;
  tradeCount: number;
}

export interface BacktestResult {
  id: string;
  datasetName: string;
  startedAt: string;
  completedAt?: string;
  status: 'queued' | 'running' | 'failed' | 'completed' | 'cancelled';
  summary?: BacktestResultSummary;
  progress: BacktestProgressPoint[];
  logs: string[];
}

