import { createBrowserRouter } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { BacktestsPage } from './routes/Backtests';
import { StrategyLibraryPage } from './routes/StrategyLibrary';
import { LiveControlPage } from './routes/LiveControl';
import { DataManagerPage } from './routes/DataManager';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <BacktestsPage /> },
      { path: 'strategies', element: <StrategyLibraryPage /> },
      { path: 'live', element: <LiveControlPage /> },
      { path: 'data', element: <DataManagerPage /> }
    ]
  }
]);

