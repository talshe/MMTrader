---
name: python-backtest-compute
description: Extends Python backtest calculations, metrics, and data loading in the py-runner service. Use when editing backtest logic, Pydantic models, or performance in apps/py-runner.
---

# Python Backtest Compute

## Quick Start
- API: `apps/py-runner/src/main.py`
- Logic: `apps/py-runner/src/service/backtest.py`
- Models: `apps/py-runner/src/models.py`

## Workflow
1. Update Pydantic models first for any new fields.
2. Implement calculations in `backtest.py` using Polars.
3. Return a `BacktestResult` with `summary` and `progress`.
4. Keep output shape compatible with `packages/core/src/backtest/types.ts`.

## Data Loading
- Inputs are CSV/Parquet from `data/`.
- Keep filtering and time range logic consistent with the request.
- Prefer vectorized Polars ops for speed.

## Validation
- Ensure metrics are numeric and finite.
- Guard empty datasets with clear errors.
