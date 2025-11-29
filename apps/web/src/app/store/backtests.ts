import { create } from 'zustand';
import type { AxiosError } from 'axios';
import type { BacktestResult } from '@mmtrader/core';
import { api } from '../api/client';
import type { BacktestState, CreateBacktestPayload } from '../types';

export const useBacktests = create<BacktestState>((set, get) => ({
  items: [],
  loading: false,
  error: undefined,
  refresh: async () => {
    set({ loading: true, error: undefined });
    try {
      const { data } = await api.get<BacktestResult[]>('/backtests');
      set({ items: data, loading: false });
    } catch (error) {
      const message = (error as AxiosError)?.message ?? 'Failed to load backtests';
      set({ loading: false, error: message });
    }
  },
  createBacktest: async (payload: CreateBacktestPayload) => {
    try {
      await api.post('/backtests', payload);
      await get().refresh();
    } catch (error) {
      const message = (error as AxiosError)?.message ?? 'Failed to create backtest';
      set({ error: message });
      throw error;
    }
  }
}));

