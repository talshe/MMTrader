import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useBacktests } from '../store/backtests';
import { useDatasets } from '../store/datasets';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { Sparkline } from '../components/Sparkline';
import type { CreateBacktestPayload } from '../types';

const initialForm: CreateBacktestPayload = {
  datasetName: '',
  startDate: '',
  endDate: '',
  entryZ: 2,
  exitZ: 0.5,
  zScoreLookback: 60,
  legRatio: 1
};

export const BacktestsPage = () => {
  const [form, setForm] = useState<CreateBacktestPayload>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const { items, loading, error, createBacktest, refresh } = useBacktests();
  const datasets = useDatasets((state) => state.items);
  const refreshDatasets = useDatasets((state) => state.refresh);

  useEffect(() => {
    refreshDatasets().catch(() => {});
  }, [refreshDatasets]);

  const aggregates = useMemo(() => {
    const completed = items.filter((item) => item.status === 'completed');
    const totalPnL = completed.reduce((acc, run) => acc + (run.summary?.totalPnL ?? 0), 0);
    return {
      completed: completed.length,
      totalPnL: totalPnL.toFixed(2),
      running: items.filter((item) => item.status === 'running').length
    };
  }, [items]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.datasetName) return;
    setSubmitting(true);
    try {
      await createBacktest(form);
      setForm({ ...initialForm });
    } catch {
      // store already tracks the error
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 p-8">
      <header>
        <h1 className="text-3xl font-semibold text-white">Backtest Runs</h1>
        <p className="text-sm text-slate-400">
          Launch and monitor spread analytics powered by the Python compute engine.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Completed runs" value={String(aggregates.completed)} />
        <StatCard label="Active runs" value={String(aggregates.running)} />
        <StatCard label="Aggregate PnL" value={`$${aggregates.totalPnL}`} />
      </div>

      <section className="grid gap-6 lg:grid-cols-[320px,1fr]">
        <form
          onSubmit={onSubmit}
          className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 space-y-4"
        >
          <h2 className="text-lg font-semibold text-white">Launch Backtest</h2>
          <label className="space-y-1 text-sm">
            <span className="text-slate-400">Dataset</span>
            <select
              required
              value={form.datasetName}
              onChange={(event) => setForm({ ...form, datasetName: event.target.value })}
              className="w-full rounded border border-slate-700 bg-slate-900 p-2 text-white"
            >
              <option value="">Select dataset</option>
              {datasets.map((dataset) => (
                <option key={dataset.name} value={dataset.name}>
                  {dataset.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1 text-sm">
              <span className="text-slate-400">Start</span>
              <input
                type="datetime-local"
                required
                value={form.startDate}
                onChange={(event) => setForm({ ...form, startDate: event.target.value })}
                className="w-full rounded border border-slate-700 bg-slate-900 p-2 text-white"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-slate-400">End</span>
              <input
                type="datetime-local"
                required
                value={form.endDate}
                onChange={(event) => setForm({ ...form, endDate: event.target.value })}
                className="w-full rounded border border-slate-700 bg-slate-900 p-2 text-white"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1 text-sm">
              <span className="text-slate-400">Entry Z</span>
              <input
                type="number"
                step="0.1"
                min="0"
                value={form.entryZ}
                onChange={(event) =>
                  setForm({ ...form, entryZ: Number.parseFloat(event.target.value) })
                }
                className="w-full rounded border border-slate-700 bg-slate-900 p-2 text-white"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-slate-400">Exit Z</span>
              <input
                type="number"
                step="0.1"
                min="0"
                value={form.exitZ}
                onChange={(event) =>
                  setForm({ ...form, exitZ: Number.parseFloat(event.target.value) })
                }
                className="w-full rounded border border-slate-700 bg-slate-900 p-2 text-white"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1 text-sm">
              <span className="text-slate-400">Lookback</span>
              <input
                type="number"
                min="10"
                value={form.zScoreLookback}
                onChange={(event) =>
                  setForm({ ...form, zScoreLookback: Number.parseInt(event.target.value, 10) })
                }
                className="w-full rounded border border-slate-700 bg-slate-900 p-2 text-white"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-slate-400">Leg ratio</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.legRatio}
                onChange={(event) =>
                  setForm({ ...form, legRatio: Number.parseFloat(event.target.value) })
                }
                className="w-full rounded border border-slate-700 bg-slate-900 p-2 text-white"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting || !form.datasetName}
            className="w-full rounded bg-blue-500 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {submitting ? 'Launching...' : 'Launch'}
          </button>
        </form>

        <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent runs</h2>
            <button
              onClick={() => {
                refresh().catch(() => {});
              }}
              className="text-xs text-blue-400 hover:text-blue-200"
            >
              Refresh
            </button>
          </div>
          {error ? <p className="text-sm text-rose-400">{error}</p> : null}
          {loading ? <p className="text-sm text-slate-400">Loading...</p> : null}

          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded border border-slate-800 bg-slate-900/60 p-3 text-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">{item.id.slice(0, 8)}</p>
                    <p className="text-xs text-slate-500">{item.datasetName}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
                {item.summary ? (
                  <div className="mt-2 grid gap-4 md:grid-cols-3">
                    <p>PNL: ${item.summary.totalPnL.toFixed(2)}</p>
                    <p>Sharpe: {item.summary.sharpe.toFixed(2)}</p>
                    <p>DD: {item.summary.maxDrawdown.toFixed(2)}</p>
                  </div>
                ) : null}
                <div className="mt-2">
                  <Sparkline points={(item.progress ?? []).map((point) => point.value)} />
                </div>
              </div>
            ))}
            {items.length === 0 && !loading ? (
              <p className="text-sm text-slate-500">No runs yet.</p>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
};

