import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// render - Portfolio
const PortfolioDashboard = Loadable(lazy(() => import('pages/portfolio/dashboard')));
const PortfolioAnalytics = Loadable(lazy(() => import('pages/portfolio/analytics')));
const PortfolioHoldings = Loadable(lazy(() => import('pages/portfolio/holdings')));
const PortfolioReports = Loadable(lazy(() => import('pages/portfolio/reports')));
const PortfolioSettings = Loadable(lazy(() => import('pages/portfolio/settings')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <DashboardLayout />,
  children: [
    {
      path: '/',
      element: <PortfolioDashboard />
    },
    {
      path: 'portfolio',
      children: [
        {
          path: 'dashboard',
          element: <PortfolioDashboard />
        },
        {
          path: 'analytics',
          element: <PortfolioAnalytics />
        },
        {
          path: 'holdings',
          element: <PortfolioHoldings />
        },
        {
          path: 'reports',
          element: <PortfolioReports />
        },
        {
          path: 'settings',
          element: <PortfolioSettings />
        }
      ]
    },
  ]
};

export default MainRoutes;
