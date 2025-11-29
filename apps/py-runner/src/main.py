from fastapi import FastAPI, HTTPException

from .models import BacktestPayload, BacktestResult
from .service.backtest import run_spread_backtest

app = FastAPI(title='MMTrader Python Runner')


@app.get('/health')
def health():
  return {'status': 'ok'}


@app.post('/run-backtest', response_model=BacktestResult)
def run_backtest(payload: BacktestPayload):
  try:
    return run_spread_backtest(payload)
  except FileNotFoundError as err:
    raise HTTPException(status_code=404, detail=str(err)) from err
  except ValueError as err:
    raise HTTPException(status_code=400, detail=str(err)) from err
  except Exception as err:  # pragma: no cover
    raise HTTPException(status_code=500, detail='Unexpected error') from err


if __name__ == '__main__':
  import uvicorn

  uvicorn.run(app, host='0.0.0.0', port=8001)

