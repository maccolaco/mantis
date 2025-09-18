import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// render - Portfolio
const PortfolioDashboard = Loadable(lazy(() => import('pages/portfolio/dashboard')));

// render - color
const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

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
    {
      path: 'typography',
      element: <Typography />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    }
  ]
};

export default MainRoutes;
