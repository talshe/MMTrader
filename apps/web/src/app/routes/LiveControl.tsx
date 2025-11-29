import { useEffect, useState } from 'react';
import { api } from '../api/client';

export const LiveControlPage = () => {
  const [venues, setVenues] = useState<string[]>([]);

  useEffect(() => {
    api
      .get<string[]>('/live/adapters')
      .then((response) => setVenues(response.data))
      .catch(() => setVenues([]));
  }, []);

  return (
    <div className="space-y-6 p-8">
      <header>
        <h1 className="text-3xl font-semibold text-white">Live Trading Control</h1>
        <p className="text-sm text-slate-400">
          Configure venues and adapters. Real implementations can plug into this view via the shared
          adapter contract.
        </p>
      </header>
      <div className="rounded-lg border border-amber-400/20 bg-amber-500/5 p-4 text-sm text-amber-200">
        Live trading connectors are not configured yet. Add credentials and adapter implementations
        under `packages/core` and the trader service will expose them here automatically.
      </div>
      <div className="rounded border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="text-lg font-semibold text-white">Detected adapters</h2>
        <ul className="mt-2 list-disc pl-4 text-sm text-slate-300">
          {venues.length ? venues.map((venue) => <li key={venue}>{venue}</li>) : <li>mock</li>}
        </ul>
      </div>
    </div>
  );
};

