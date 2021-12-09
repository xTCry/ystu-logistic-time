import React from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import AppContent from './components/AppContent.component';
import InitialWorkSettings from './components/InitialWorkSettings.component';
import Footer from './components/Footer.component';

const App = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{
          position: 'relative',
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Logistic Time
          </Typography>
        </Toolbar>
      </AppBar>

      <Box pt={4}>
        <InitialWorkSettings>
          <AppContent />
        </InitialWorkSettings>
      </Box>

      <Footer />
    </ThemeProvider>
  );
};

export default App;
