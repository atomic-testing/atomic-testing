import { Theme } from '@astryxdesign/core/theme';
import { neutralTheme } from '@astryxdesign/theme-neutral/built';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

import './index.css';

// The Theme provider lives at the browser app shell. The jsdom suite renders <App />
// without it (Astryx components render bare under jsdom; drivers read DOM/ARIA), so the
// fully themed setup is exercised end-to-end only in the Playwright run.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme theme={neutralTheme}>
      <App />
    </Theme>
  </StrictMode>
);
