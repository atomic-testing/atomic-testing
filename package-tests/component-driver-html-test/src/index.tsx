import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { ExampleApp } from '@atomic-testing/internal-react-example-19';

import { Home } from './Home';
import { tocs } from './directory';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ExampleApp home={Home} tocs={tocs} />
    </BrowserRouter>
  </React.StrictMode>
);
