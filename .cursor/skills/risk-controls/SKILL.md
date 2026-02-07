---
name: risk-controls
description: Adds and enforces risk limits, position sizing, and kill-switch behavior for live trading and backtests. Use when implementing guardrails, safety checks, or trading limits.
---

# Risk Controls

## Quick Start
- Live interfaces: `packages/core/src/providers/live-provider.ts`
- Live API: `apps/trader/src/routes/live.ts`
- Backtest results: `packages/core/src/backtest/types.ts`

## Workflow
1. Define risk limits (max drawdown, max position, daily loss).
2. Enforce limits before order submission.
3. Add kill-switch conditions and fail-safe shutdowns.
4. Surface risk state in API responses for the UI.

## Guardrails
- Make limits configurable via env or config.
- Prefer explicit failure states over silent blocks.
