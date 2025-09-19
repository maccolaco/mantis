import { RouterProvider } from 'react-router-dom';

// project imports
import router from 'routes';
import ThemeCustomization from 'themes';
import { ThemeProvider } from 'contexts/ThemeContext';
import { TextSizeProvider } from 'contexts/TextSizeContext';

import ScrollTop from 'components/ScrollTop';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  return (
    <ThemeProvider>
      <TextSizeProvider>
        <ThemeCustomization>
          <ScrollTop>
            <RouterProvider router={router} />
          </ScrollTop>
        </ThemeCustomization>
      </TextSizeProvider>
    </ThemeProvider>
  );
}