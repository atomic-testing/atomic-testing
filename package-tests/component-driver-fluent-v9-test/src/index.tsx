import { ExampleApp } from '@atomic-testing/internal-react-example';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { tocs } from './directory';
import { Home } from './Home';

import './index.css';

// Every Fluent v9 component needs a FluentProvider ancestor (it supplies the
// Griffel theme tokens and the useFluent() context components read) — but the
// jsdom suite renders each example's `ui` directly via createTestEngine, which
// never passes through this file. So each example wraps itself in its own
// FluentProvider (mirroring how the Radix suite's Tooltip.Provider lives
// inside its own example) rather than relying on one supplied here, which
// jsdom would never see.
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ExampleApp home={Home} tocs={tocs} />
    </BrowserRouter>
  </React.StrictMode>
);
