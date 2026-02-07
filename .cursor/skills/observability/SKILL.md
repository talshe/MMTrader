---
name: observability
description: Adds structured logging, metrics, and health checks across services. Use when improving monitoring, debugging, or operational visibility.
---

# Observability

## Quick Start
- Trader server: `apps/trader/src/main.ts`
- Python service: `apps/py-runner/src/main.py`
- Web client: `apps/web/src/features/api/client.ts`

## Workflow
1. Add structured logs with consistent fields.
2. Instrument key operations with timings and counters.
3. Expose health endpoints and readiness checks.
4. Surface correlation IDs across requests.

## Guardrails
- Avoid logging sensitive data.
- Keep logging levels configurable.
