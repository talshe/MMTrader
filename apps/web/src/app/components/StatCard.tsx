interface StatCardProps {
  label: string;
  value: string;
  helper?: string;
}

export const StatCard = ({ label, value, helper }: StatCardProps) => (
  <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 shadow-inner">
    <p className="text-xs uppercase tracking-widest text-slate-400">{label}</p>
    <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    {helper ? <p className="mt-1 text-xs text-slate-500">{helper}</p> : null}
  </div>
);

