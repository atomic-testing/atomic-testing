import { ExampleApp } from '@atomic-testing/internal-react-example';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { tocs } from './directory';
import { Home } from './Home';

import './index.css';

// Radix primitives are unstyled and need no provider at the app shell (Tooltip's
// Provider lives inside its own example) — the browser app and the jsdom suite
// render the same bare components.
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ExampleApp home={Home} tocs={tocs} />
    </BrowserRouter>
  </React.StrictMode>
);
