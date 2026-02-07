---
name: spread-strategy
description: Maintains the spread strategy logic and parameters in the shared core package. Use when modifying z-score signals, entry/exit logic, or adding new spread strategy variants.
---

# Spread Strategy

## Quick Start
- Strategy: `packages/core/src/strategies/spread.ts`
- Types: `packages/core/src/backtest/types.ts`

## Workflow
1. Update the config shape and defaults if parameters change.
2. Keep signal generation pure and deterministic.
3. Verify entry/exit thresholds and lookback windows.
4. Ensure types exported in `packages/core/src/index.ts` if needed.

## Guardrails
- Avoid side effects or IO in strategy functions.
- Maintain consistent units for prices and ratios.
