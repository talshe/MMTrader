from __future__ import annotations

from datetime import datetime
from typing import Literal
from pydantic import BaseModel, Field


class SpreadLeg(BaseModel):
  symbol: str
  multiplier: float


class BacktestPayload(BaseModel):
  id: str
  datasetName: str
  legs: tuple[SpreadLeg, SpreadLeg]
  startDate: datetime
  endDate: datetime
  resolution: Literal['1s', '1m', '5m']
  parameters: dict[str, float | int | str]


class BacktestProgressPoint(BaseModel):
  timestamp: datetime
  value: float


class BacktestSummary(BaseModel):
  totalPnL: float
  sharpe: float
  maxDrawdown: float
  tradeCount: int


class BacktestResult(BaseModel):
  id: str
  datasetName: str
  startedAt: datetime
  completedAt: datetime
  status: Literal['queued', 'running', 'failed', 'completed']
  summary: BacktestSummary
  progress: list[BacktestProgressPoint]
  logs: list[str] = Field(default_factory=list)

