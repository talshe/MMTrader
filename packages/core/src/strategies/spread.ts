import type { HistoricalChunk } from '../providers/data-provider';

export interface SpreadStrategyConfig {
  legRatio: number;
  zScoreLookback: number;
  entryZ: number;
  exitZ: number;
}

export type SpreadSignal = {
  timestamp: number;
  zScore: number;
  spread: number;
  action: 'long' | 'short' | 'flat';
};

export const computeSpreadSignals = (
  stream: HistoricalChunk[],
  config: SpreadStrategyConfig
): SpreadSignal[] => {
  if (!stream.length) {
    return [];
  }

  const { legRatio, zScoreLookback, entryZ, exitZ } = config;
  const spreads: number[] = [];
  const result: SpreadSignal[] = [];
  let position: 'long' | 'short' | 'flat' = 'flat';

  for (let i = 0; i < stream.length; i += 1) {
    const row = stream[i];
    const spread = row.legA - legRatio * row.legB;
    spreads.push(spread);

    if (spreads.length < zScoreLookback) {
      continue;
    }

    const window = spreads.slice(-zScoreLookback);
    const mean =
      window.reduce((acc, val) => acc + val, 0) / (window.length || Number.POSITIVE_INFINITY);
    const variance =
      window.reduce((acc, val) => acc + (val - mean) ** 2, 0) / (window.length || 1);
    const std = Math.sqrt(variance);
    const zScore = std === 0 ? 0 : (spread - mean) / std;

    if (position === 'flat') {
      if (zScore >= entryZ) {
        position = 'short';
      } else if (zScore <= -entryZ) {
        position = 'long';
      }
    } else if (position === 'long' && zScore >= -exitZ) {
      position = 'flat';
    } else if (position === 'short' && zScore <= exitZ) {
      position = 'flat';
    }

    result.push({
      timestamp: row.timestamp,
      zScore,
      spread,
      action: position
    });
  }

  return result;
};

