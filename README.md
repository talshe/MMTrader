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

### Backtest API Endpoints

The trader API provides full CRUD operations for backtest runs:

**Create Backtest:**
```bash
POST /api/backtests
Content-Type: application/json

{
  "datasetName": "ym_es_1s.csv",
  "startDate": "2024-01-01T00:00:00",
  "endDate": "2024-01-31T23:59:59",
  "entryZ": 2.0,
  "exitZ": 0.5,
  "zScoreLookback": 60,
  "legRatio": 1.0
}
```

**List Backtests:**
```bash
GET /api/backtests
```

**Get Backtest:**
```bash
GET /api/backtests/:id
```

**Update Backtest Metadata:**
```bash
PATCH /api/backtests/:id
Content-Type: application/json

{
  "datasetName": "ym_es_1s.csv",
  "entryZ": 2.5
  // ... any other fields to update
}
```
Note: Cannot update running backtests. Only metadata updates are allowed (does not re-run the backtest).

**Delete Backtest:**
```bash
DELETE /api/backtests/:id
```
Note: If the backtest is running, it will be cancelled first, then deleted. The status will be set to `cancelled` before deletion.

### Database Setup

The trader backend uses PostgreSQL to persist backtest runs. Before starting the service:

1. Ensure PostgreSQL is running and accessible
2. Create the backtests database:
   ```bash
   createdb moneymaker_trader
   ```
3. Run the schema migration:
   ```bash
   psql -d moneymaker_trader -f docs/backtests-db.sql
   ```

### Environment variables

**Trader API:**
- `PY_SERVICE_URL` – override the Python runner URL (default `http://127.0.0.1:8001`)
- `DB_HOST` – PostgreSQL host (default `localhost`)
- `DB_PORT` – PostgreSQL port (default `5432`)
- `TRADER_DB_NAME` – Database name for trader data (default `moneymaker_trader`, falls back to `DB_NAME`)
- `DB_USER` – PostgreSQL user (default `postgres`)
- `DB_PASSWORD` – PostgreSQL password (default `Shmsh001!`)
- `DB_SSL` – Set to `'false'` to disable SSL (default SSL enabled)
- `DB_MAX_CONNECTIONS` – Connection pool size (default `20`)
- `DB_IDLE_TIMEOUT` – Idle timeout in milliseconds (default `30000`)
- `DB_CONNECTION_TIMEOUT` – Connection timeout in milliseconds (default `30000`)

**Web App:**
- `VITE_TRADER_URL` – override the Trader API used by the web app (default `http://localhost:4000/api`)
