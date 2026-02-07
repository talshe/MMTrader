---
name: web-dashboard
description: Builds and maintains the React dashboard routes, stores, and API integration. Use when editing UI routes, Zustand stores, or the web API client.
---

# Web Dashboard

## Quick Start
- Router: `apps/web/src/features/router.tsx`
- Routes: `apps/web/src/features/routes/*.tsx`
- Stores: `apps/web/src/features/store/*.ts`
- API client: `apps/web/src/features/api/client.ts`

## Workflow
1. Add or edit a route and update navigation in the layout.
2. Extend Zustand stores for new state.
3. Wire API calls through `client.ts`.
4. Keep types in `apps/web/src/features/types.ts` aligned with backend.

## UI Guardrails
- Keep components small and reusable.
- Prefer stateless display components in `components/`.
