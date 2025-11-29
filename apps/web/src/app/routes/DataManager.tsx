import { useEffect } from 'react';
import { useDatasets } from '../store/datasets';

export const DataManagerPage = () => {
  const items = useDatasets((state) => state.items);
  const loading = useDatasets((state) => state.loading);
  const refresh = useDatasets((state) => state.refresh);

  useEffect(() => {
    refresh().catch(() => {});
  }, [refresh]);

  return (
    <div className="space-y-6 p-8">
      <header>
        <h1 className="text-3xl font-semibold text-white">Data Manager</h1>
        <p className="text-sm text-slate-400">
          Upload CSV or Parquet files into the `data/` directory to make them available for
          backtests.
        </p>
      </header>

      <div className="rounded-lg border border-slate-800 bg-slate-900/40">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-400">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Symbols</th>
              <th className="px-4 py-2">Frequency</th>
              <th className="px-4 py-2">Last updated</th>
            </tr>
          </thead>
          <tbody>
            {items.map((dataset) => (
              <tr key={dataset.name} className="border-t border-slate-800 text-slate-200">
                <td className="px-4 py-2 font-medium">{dataset.name}</td>
                <td className="px-4 py-2">{dataset.symbols.join(', ')}</td>
                <td className="px-4 py-2">{dataset.frequency}</td>
                <td className="px-4 py-2">{dataset.lastUpdated ?? '—'}</td>
              </tr>
            ))}
            {items.length === 0 && !loading ? (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={4}>
                  No datasets found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
        {loading ? <p className="px-4 py-2 text-xs text-slate-500">Scanning data folder…</p> : null}
      </div>
    </div>
  );
};

