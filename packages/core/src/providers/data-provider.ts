export interface DatasetDescriptor {
  name: string;
  description?: string;
  symbols: string[];
  frequency: string;
  lastUpdated?: string;
}

export interface HistoricalChunk {
  timestamp: number;
  [key: string]: number;
}

export interface DataProvider {
  listDatasets(): Promise<DatasetDescriptor[]>;
  loadDataset(dataset: string): Promise<AsyncIterable<HistoricalChunk>>;
}

