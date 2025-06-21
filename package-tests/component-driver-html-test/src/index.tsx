import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { App } from '@atomic-testing/internal-react-example';
import { Home } from './Home';
import { tocs } from './directory';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App home={Home} tocs={tocs} />
    </BrowserRouter>
  </React.StrictMode>
);
