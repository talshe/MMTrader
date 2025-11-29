import { randomUUID } from 'crypto';
import { createEmptyResult, type BacktestRequest, type BacktestResult } from '@mmtrader/core';
import { getPool } from './db/pool';
import type { BacktestStore, CreateBacktestBody, UpdateBacktestMetadataBody } from './types';

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
  const pool = getPool();

  return {
    async create(body: CreateBacktestBody): Promise<BacktestRequest> {
      const request = buildRequest(body);
      const initialResult = createEmptyResult(request);
      
      await pool.query(
        `INSERT INTO backtests (id, request, result, status)
         VALUES ($1, $2, $3, $4)`,
        [request.id, JSON.stringify(request), JSON.stringify(initialResult), initialResult.status]
      );
      
      return request;
    },

    async update(id: string, mutator: (prev: BacktestResult) => BacktestResult): Promise<void> {
      const result = await pool.query(
        'SELECT result FROM backtests WHERE id = $1',
        [id]
      );
      
      if (result.rows.length === 0) {
        return;
      }

      const currentResult = result.rows[0].result as BacktestResult;
      const updatedResult = mutator(currentResult);
      
      await pool.query(
        `UPDATE backtests 
         SET result = $1, status = $2, updated_at = NOW()
         WHERE id = $3`,
        [JSON.stringify(updatedResult), updatedResult.status, id]
      );
    },

    async list(): Promise<BacktestResult[]> {
      const result = await pool.query(
        'SELECT result FROM backtests ORDER BY created_at DESC'
      );
      
      return result.rows.map((row) => row.result as BacktestResult);
    },

    async get(id: string): Promise<BacktestResult | undefined> {
      const result = await pool.query(
        'SELECT result FROM backtests WHERE id = $1',
        [id]
      );
      
      if (result.rows.length === 0) {
        return undefined;
      }
      
      return result.rows[0].result as BacktestResult;
    },

    async updateMetadata(id: string, body: UpdateBacktestMetadataBody): Promise<void> {
      const result = await pool.query(
        'SELECT request, result FROM backtests WHERE id = $1',
        [id]
      );
      
      if (result.rows.length === 0) {
        throw new Error('Backtest not found');
      }

      const currentRequest = result.rows[0].request as BacktestRequest;
      const currentResult = result.rows[0].result as BacktestResult;

      // Update request fields
      const updatedRequest: BacktestRequest = {
        ...currentRequest,
        datasetName: body.datasetName ?? currentRequest.datasetName,
        startDate: body.startDate ?? currentRequest.startDate,
        endDate: body.endDate ?? currentRequest.endDate,
        parameters: {
          ...currentRequest.parameters,
          entryZ: body.entryZ ?? currentRequest.parameters.entryZ,
          exitZ: body.exitZ ?? currentRequest.parameters.exitZ,
          lookback: body.zScoreLookback ?? currentRequest.parameters.lookback
        }
      };

      if (body.legRatio !== undefined) {
        updatedRequest.legs[1].multiplier = body.legRatio;
      }

      // Update result metadata
      const updatedResult: BacktestResult = {
        ...currentResult,
        datasetName: updatedRequest.datasetName
      };

      await pool.query(
        `UPDATE backtests 
         SET request = $1, result = $2, updated_at = NOW()
         WHERE id = $3`,
        [JSON.stringify(updatedRequest), JSON.stringify(updatedResult), id]
      );
    },

    async delete(id: string): Promise<void> {
      const result = await pool.query('DELETE FROM backtests WHERE id = $1', [id]);
      
      if (result.rowCount === 0) {
        throw new Error('Backtest not found');
      }
    },

    async getStatus(id: string): Promise<string | undefined> {
      const result = await pool.query(
        'SELECT status FROM backtests WHERE id = $1',
        [id]
      );
      
      if (result.rows.length === 0) {
        return undefined;
      }
      
      return result.rows[0].status;
    }
  };
};
