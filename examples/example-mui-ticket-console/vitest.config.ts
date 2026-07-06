import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// https://vitest.dev/config/
export default defineConfig({
  plugins: [react()],
  // The atomic-testing packages are symlinked monorepo builds; dedupe React/Emotion so the app
  // and the linked ReactInteractor share one copy (act() flushing relies on a single React).
  resolve: { dedupe: ['react', 'react-dom', '@emotion/react', '@emotion/styled'] },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    // Only the atomic-testing component tests. Playwright specs under /e2e run via Playwright.
    include: ['src/**/__tests__/**/*.test.{ts,tsx}'],
    testTimeout: 30000,
    // MUI-X v9 reaches `core-js-pure` through `@mui/x-internals` via an extensionless directory
    // import that Node's native ESM resolver rejects. Inlining the whole `@mui/x-*` chain (and
    // core-js-pure) routes those imports through Vite's resolver, which handles them, so the grid,
    // pickers, and tree load under jsdom. `fallbackCJS` lets Vite fall back to a package's CJS build
    // when its ESM entry is not resolvable.
    server: { deps: { inline: [/@mui\/x-/, /core-js-pure/], fallbackCJS: true } },
  },
});
