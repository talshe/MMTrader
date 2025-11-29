## MMTrader Monorepo

This workspace hosts a React dashboard, a Node.js orchestration service, and a Python compute runner for YM/ES spread analytics. The repo is structured with Nx to keep UI, services, and shared packages in sync.

### Layout

- `apps/web` – Vite + React UI for managing datasets, backtests, and live control placeholders.
- `apps/trader` – Fastify-based orchestrator that exposes REST/WebSocket ready endpoints and forwards compute jobs to Python.
- `apps/py-runner` – FastAPI service executing heavy spread calculations using `polars`.
- `packages/core` – Shared TypeScript contracts, strategy helpers, and adapter abstractions.
- `data/` – Drop CSV/Parquet historical files here for backtests.

### Getting started

1. Install JS dependencies:

   ```bash
   npm install
   ```

2. Start the Python service:

   ```bash
   cd apps/py-runner
   python -m venv .venv
   source .venv/bin/activate  # Windows: .venv\Scripts\activate
   pip install -e .
   uvicorn src.main:app --reload --port 8001
   ```

3. Launch the trader API (needs Node 18+):

   ```bash
   npm run dev:trader
   ```

4. Launch the UI:

   ```bash
   npm run dev:web
   ```

Upload your tick files to `data/` (e.g., `ym_es_1s.csv`) and create runs from the dashboard.

### Environment variables

- `PY_SERVICE_URL` – override the Python runner URL (default `http://127.0.0.1:8001`)
- `VITE_TRADER_URL` – override the Trader API used by the web app (default `http://localhost:4000/api`)
