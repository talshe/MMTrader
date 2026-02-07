---
name: db-migrations
description: Guides safe schema evolution for the backtests database, including JSONB changes and compatibility. Use when modifying database schema or migrations.
---

# DB Migrations

## Quick Start
- Schema: `docs/backtests-db.sql`
- Store: `apps/trader/src/store.ts`
- Pool: `apps/trader/src/db/pool.ts`

## Workflow
1. Design backward-compatible changes first.
2. Update schema and store logic together.
3. Backfill or transform JSONB fields if needed.
4. Add rollback plan for destructive changes.

## Guardrails
- Avoid breaking changes to `request`/`result` JSONB.
- Keep migrations small and reversible.
