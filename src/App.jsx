import { RouterProvider } from 'react-router-dom';

// project imports
import router from 'routes';
import ThemeCustomization from 'themes';
import { ThemeProvider } from 'contexts/ThemeContext';
import { PortfolioProvider } from 'contexts/PortfolioContext';

import ScrollTop from 'components/ScrollTop';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  return (
    <ThemeProvider>
      <PortfolioProvider>
        <ThemeCustomization>
          <ScrollTop>
            <RouterProvider router={router} />
          </ScrollTop>
        </ThemeCustomization>
      </PortfolioProvider>
    </ThemeProvider>
  );
}
