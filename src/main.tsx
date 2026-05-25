import '@fontsource/fredoka/400.css';
import '@fontsource/fredoka/500.css';
import '@fontsource/fredoka/600.css';
import '@fontsource/fredoka/700.css';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';

const theme = createTheme({
  primaryColor: 'grape',
  defaultRadius: 'xl',
  fontFamily: 'Fredoka, system-ui, -apple-system, sans-serif',
  headings: {
    fontFamily: 'Fredoka, system-ui, sans-serif',
    fontWeight: '700'
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <App />
    </MantineProvider>
  </React.StrictMode>
);
