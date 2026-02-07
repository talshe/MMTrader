---
name: execution-modeling
description: Improves backtest realism with slippage, fees, spreads, and execution rules. Use when adding or tuning execution assumptions in backtests.
---

# Execution Modeling

## Quick Start
- Backtest types: `packages/core/src/backtest/types.ts`
- Python compute: `apps/py-runner/src/service/backtest.py`
- Strategy logic: `packages/core/src/strategies/spread.ts`

## Workflow
1. Define execution assumptions (fees, slippage, spread).
2. Apply adjustments consistently to entry and exit prices.
3. Expose parameters in request payloads.
4. Report execution-adjusted metrics in results.

## Guardrails
- Keep modeling deterministic.
- Avoid double-counting fees or slippage.
