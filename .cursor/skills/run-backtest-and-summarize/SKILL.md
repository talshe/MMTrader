---
name: run-backtest-and-summarize
description: Runs a backtest using an existing config and summarizes key performance metrics. Use when asked to run a backtest and report results.
---
# Run Backtest and Summarize

## Instructions
1. Find the repo's standard backtest command or runner (README or project config).
2. Execute the backtest with the specified config file or ID.
3. Collect key outputs (PnL, Sharpe, drawdown, win rate, trades).
4. Summarize results in a short markdown report.
5. Note any warnings or data gaps.

## Report template
```
# Backtest Summary

## Config
- Name/ID: ...
- Date range: ...

## Performance
- Total PnL: ...
- Sharpe: ...
- Max drawdown: ...
- Win rate: ...
- Trades: ...

## Notes
- ...
```

## Example triggers
- "Run this backtest"
- "Backtest and summarize results"
