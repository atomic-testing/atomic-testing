import { Theme } from '@astryxdesign/core/theme';
import { neutralTheme } from '@astryxdesign/theme-neutral/built';
import { ExampleApp } from '@atomic-testing/internal-react-example';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { tocs } from './directory';
import { Home } from './Home';

import './index.css';

// The Theme provider lives at the browser app shell (not inside the shared
// examples), so the real themed Astryx setup is exercised end-to-end in the
// browser while the jsdom suite renders the bare components — keeping the jest
// transform surface to the component subpath only.
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Theme theme={neutralTheme}>
      <BrowserRouter>
        <ExampleApp home={Home} tocs={tocs} />
      </BrowserRouter>
    </Theme>
  </React.StrictMode>
);
