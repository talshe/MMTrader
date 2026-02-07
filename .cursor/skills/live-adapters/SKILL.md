---
name: live-adapters
description: Implements and registers live trading adapters and exposes them via the trader API. Use when adding a venue adapter, order handling, or live control endpoints.
---

# Live Adapters

## Quick Start
- Interface: `packages/core/src/providers/live-provider.ts`
- Registry: `apps/trader/src/adapters/registry.ts`
- API: `apps/trader/src/routes/live.ts`

## Workflow
1. Implement the `LiveTradingAdapter` interface.
2. Register the adapter in the registry.
3. Surface adapter status via the live routes.
4. Keep mock adapter for local testing.

## Guardrails
- Do not place secrets in code; read via env vars.
- Ensure adapter errors are surfaced in API responses.
