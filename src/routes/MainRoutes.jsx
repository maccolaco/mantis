import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// render - Portfolio
const PortfolioDashboard = Loadable(lazy(() => import('pages/portfolio/dashboard')));

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
          element: <PortfolioDashboard />
        },
        {
          path: 'holdings',
          element: <PortfolioDashboard />
        },
        {
          path: 'reports',
          element: <PortfolioDashboard />
        },
        {
          path: 'settings',
          element: <PortfolioDashboard />
        }
      ]
    },
  ]
};

export default MainRoutes;
