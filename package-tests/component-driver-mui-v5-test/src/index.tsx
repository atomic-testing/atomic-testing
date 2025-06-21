import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider } from '@mui/material/styles';

import { App } from '@atomic-testing/internal-react-example';
import { Home } from './Home';
import { tocs } from './directory';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <CssBaseline />
      <BrowserRouter>
        <App home={Home} tocs={tocs} />
      </BrowserRouter>
    </StyledEngineProvider>
  </React.StrictMode>
);
