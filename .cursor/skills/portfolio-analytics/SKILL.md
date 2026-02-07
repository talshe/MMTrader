---
name: portfolio-analytics
description: Adds portfolio-level analytics and reporting across strategies, including exposure, correlation, and aggregated metrics. Use when building multi-strategy views or rollups.
---

# Portfolio Analytics

## Quick Start
- Backtest types: `packages/core/src/backtest/types.ts`
- Web stores: `apps/web/src/features/store/*.ts`

## Workflow
1. Define portfolio aggregation inputs and outputs.
2. Compute exposure, allocation, and correlation metrics.
3. Add rollup summaries to API responses.
4. Visualize portfolio metrics in the UI.

## Guardrails
- Keep calculations consistent with single-strategy metrics.
- Avoid heavy computations on the web client.
