# Python Compute Runner

## Setup

```bash
cd apps/py-runner
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -e .
```

## Usage

```bash
uvicorn src.main:app --reload --port 8001
```

The service expects datasets under `data/` in the repository root and exposes:

- `GET /health` for readiness checks
- `POST /run-backtest` to run spread analytics for YM/ES pairs

