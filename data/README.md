# Data Directory

Place CSV or Parquet files containing historical tick data here. The trader service scans this folder and exposes datasets to the compute pipeline.

Expected columns:

- `timestamp` – ISO string or epoch seconds
- `leg_a` / `leg_b` or `YM` / `ES` prices

File naming is flexible; simply reference the filename from the UI when launching a backtest.

