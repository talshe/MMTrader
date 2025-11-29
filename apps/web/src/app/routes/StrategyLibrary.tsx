const strategies = [
  {
    name: 'YM/ES Spread Mean Reversion',
    description: 'Z-score driven entry/exit gates for 1s resolution futures data.',
    status: 'Validated'
  },
  {
    name: 'Bond / Equity Hedge',
    description: 'Placeholder for future adapter that pairs ZN vs ES micro moves.',
    status: 'Draft'
  }
];

export const StrategyLibraryPage = () => (
  <div className="space-y-6 p-8">
    <div>
      <h1 className="text-3xl font-semibold text-white">Strategy Library</h1>
      <p className="text-sm text-slate-400">
        Central catalog for research ideas, documentation, and deployment readiness.
      </p>
    </div>
    <div className="grid gap-4">
      {strategies.map((strategy) => (
        <div
          key={strategy.name}
          className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 shadow-inner"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-white">{strategy.name}</p>
              <p className="text-sm text-slate-400">{strategy.description}</p>
            </div>
            <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
              {strategy.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

