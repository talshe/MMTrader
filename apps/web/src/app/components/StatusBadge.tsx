interface StatusBadgeProps {
  status: 'queued' | 'running' | 'failed' | 'completed' | 'cancelled';
}

const colors: Record<StatusBadgeProps['status'], string> = {
  queued: 'bg-slate-700 text-slate-100',
  running: 'bg-amber-500/20 text-amber-300',
  failed: 'bg-rose-500/20 text-rose-300',
  completed: 'bg-emerald-500/20 text-emerald-300',
  cancelled: 'bg-orange-500/20 text-orange-300'
};

export const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${colors[status]}`}>
    {status.toUpperCase()}
  </span>
);

