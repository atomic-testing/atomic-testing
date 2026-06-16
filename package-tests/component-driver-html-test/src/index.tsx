import { ExampleApp } from '@atomic-testing/internal-react-example';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { tocs } from './directory';
import { Home } from './Home';

import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ExampleApp home={Home} tocs={tocs} />
    </BrowserRouter>
  </React.StrictMode>
);
