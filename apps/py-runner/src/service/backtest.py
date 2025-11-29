from __future__ import annotations

from datetime import datetime
from pathlib import Path
from typing import Iterable

import polars as pl

from ..models import BacktestPayload, BacktestProgressPoint, BacktestResult, BacktestSummary

ROOT = Path(__file__).resolve().parents[4]
DATA_DIR = ROOT / 'data'


def _load_frame(dataset_name: str) -> pl.DataFrame:
  path = DATA_DIR / dataset_name
  if not path.exists():
    raise FileNotFoundError(f'Dataset {dataset_name} not found in {DATA_DIR}')

  if path.suffix == '.csv':
    return pl.read_csv(path)

  if path.suffix in {'.parquet', '.pq'}:
    return pl.read_parquet(path)

  raise ValueError(f'Unsupported file type for {dataset_name}')


def _resolve_column(frame: pl.DataFrame, candidates: Iterable[str], fallback: str) -> str:
  lower_map = {col.lower(): col for col in frame.columns}
  for candidate in candidates:
    if candidate in lower_map:
      return lower_map[candidate]
  if fallback not in frame.columns:
    raise ValueError(f'Unable to determine column for {fallback}')
  return fallback


def _to_datetime(value) -> datetime:
  if isinstance(value, datetime):
    return value
  if isinstance(value, (int, float)):
    return datetime.fromtimestamp(value)
  return datetime.fromisoformat(str(value))


def _generate_progress(frame: pl.DataFrame) -> list[BacktestProgressPoint]:
  progress: list[BacktestProgressPoint] = []
  for row in frame.iter_rows(named=True):
    progress.append(
      BacktestProgressPoint(
        timestamp=_to_datetime(row['timestamp']),
        value=float(row['spread'])
      )
    )
  return progress[-250:]


def run_spread_backtest(payload: BacktestPayload) -> BacktestResult:
  frame = _load_frame(payload.datasetName)
  leg_a = _resolve_column(frame, ('ym', 'lega', 'leg_a'), frame.columns[1])
  leg_b = _resolve_column(frame, ('es', 'legb', 'leg_b'), frame.columns[2])

  filtered = frame.filter(
    (pl.col('timestamp') >= payload.startDate.isoformat())
    & (pl.col('timestamp') <= payload.endDate.isoformat())
  ).with_columns(
    (pl.col(leg_a) - payload.legs[1].multiplier * pl.col(leg_b)).alias('spread')
  )

  spread = filtered.select('timestamp', 'spread')
  total_pnl = float(spread['spread'].sum()) if spread.height else 0.0
  mean = float(spread['spread'].mean()) if spread.height else 0.0
  std = float(spread['spread'].std(ddof=0) or 0)
  sharpe = mean / std if std else 0.0
  max_drawdown = float((spread['spread'].cummax() - spread['spread']).max() or 0)

  summary = BacktestSummary(
    totalPnL=total_pnl,
    sharpe=sharpe,
    maxDrawdown=max_drawdown,
    tradeCount=max(spread.height // 50, 1) if spread.height else 0
  )

  now = datetime.utcnow()
  return BacktestResult(
    id=payload.id,
    datasetName=payload.datasetName,
    startedAt=now,
    completedAt=now,
    status='completed',
    summary=summary,
    progress=_generate_progress(spread),
    logs=[]
  )

