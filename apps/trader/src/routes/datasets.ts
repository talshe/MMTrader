import { promises as fs } from 'fs';
import { join } from 'path';
import type { FastifyPluginAsync } from 'fastify';
import type { DatasetDescriptor } from '@mmtrader/core';

const DATA_DIR = join(process.cwd(), 'data');

const inspectFile = async (fileName: string): Promise<DatasetDescriptor> => {
  const stats = await fs.stat(join(DATA_DIR, fileName));
  return {
    name: fileName,
    symbols: fileName.toUpperCase().includes('ES') ? ['ES'] : ['YM'],
    frequency: fileName.includes('1s') ? '1s' : 'custom',
    lastUpdated: stats.mtime.toISOString()
  };
};

export const datasetRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/datasets', async () => {
    try {
      const entries = await fs.readdir(DATA_DIR);
      const files = entries.filter((item) => item.endsWith('.csv') || item.endsWith('.parquet'));
      return Promise.all(files.map((file) => inspectFile(file)));
    } catch (error) {
      fastify.log.warn({ err: error }, 'Failed to read data directory');
      return [];
    }
  });
};

