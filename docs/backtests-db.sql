-- Backtests table schema
-- Stores backtest requests and results in JSONB columns for flexibility

CREATE TABLE IF NOT EXISTS backtests (
  id UUID PRIMARY KEY,
  request JSONB NOT NULL,
  result JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) NOT NULL
);

-- Index for status filtering
CREATE INDEX IF NOT EXISTS idx_backtests_status ON backtests(status);

-- Index for created_at for sorting
CREATE INDEX IF NOT EXISTS idx_backtests_created_at ON backtests(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_backtests_updated_at
  BEFORE UPDATE ON backtests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

