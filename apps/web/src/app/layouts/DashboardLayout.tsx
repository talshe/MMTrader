import { NavLink, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useBacktests } from '../store/backtests';

const links = [
  { to: '/', label: 'Backtests' },
  { to: '/strategies', label: 'Strategy Library' },
  { to: '/live', label: 'Live Control' },
  { to: '/data', label: 'Data Manager' }
];

export const DashboardLayout = () => {
  const refresh = useBacktests((state) => state.refresh);

  useEffect(() => {
    refresh().catch(() => {});
  }, [refresh]);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <aside className="w-64 border-r border-slate-800 bg-slate-900/40">
        <div className="px-6 py-4 text-xl font-semibold tracking-wider text-white">
          MMTrader
        </div>
        <nav className="px-4 space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `block rounded px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

