import { create } from 'zustand';
import type { AxiosError } from 'axios';
import { api } from '../api/client';
import type { DatasetDescriptor } from '../types';

interface DatasetState {
  items: DatasetDescriptor[];
  loading: boolean;
  error?: string;
  refresh: () => Promise<void>;
}

export const useDatasets = create<DatasetState>((set) => ({
  items: [],
  loading: false,
  refresh: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get<DatasetDescriptor[]>('/datasets');
      set({ items: data, loading: false, error: undefined });
    } catch (error) {
      const message = (error as AxiosError)?.message ?? 'Failed to load datasets';
      set({ loading: false, error: message });
    }
  }
}));

