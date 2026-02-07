---
name: backtest-orchestration
description: Orchestrates backtest lifecycle in the trader service, including API endpoints, status transitions, cancellation, and DB persistence. Use when changing backtest routes, job flow, or backtest storage.
---

# Backtest Orchestration

## Quick Start
- Primary entry: `apps/trader/src/routes/backtests.ts`
- Persistence: `apps/trader/src/store.ts`, `apps/trader/src/db/pool.ts`
- Python call: `apps/trader/src/lib/pythonClient.ts`

## Workflow
1. Validate request payload and map to shared types.
2. Create DB record with `queued` then transition to `running`.
3. Call Python backtest service and await result.
4. Persist result and final status (`completed`, `failed`, `cancelled`).
5. Ensure cancellation uses `AbortController` and updates status.

## Status Rules
- Allowed: `queued`, `running`, `completed`, `failed`, `cancelled`
- Do not mutate results for `running` unless streaming progress is added.

## When Editing
- Keep API responses aligned with `packages/core/src/backtest/types.ts`.
- Update both request validation and DB schema expectations together.
- On errors, store a failure message and set `failed`.
