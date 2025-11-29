import type { BacktestRequest, BacktestResult } from '@mmtrader/core';

const PY_SERVICE_URL = process.env.PY_SERVICE_URL ?? 'http://127.0.0.1:8001';

export class PythonClient {
  constructor(private readonly baseUrl: string = PY_SERVICE_URL) {}

  async runBacktest(payload: BacktestRequest): Promise<BacktestResult> {
    const response = await fetch(`${this.baseUrl}/run-backtest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Python runner responded with ${response.status}`);
    }

    return (await response.json()) as BacktestResult;
  }
}

