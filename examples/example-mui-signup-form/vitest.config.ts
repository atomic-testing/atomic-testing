import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// https://vitest.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    // Only the atomic-testing component tests. Playwright specs under /e2e
    // (and the *.stories.tsx interaction tests) are intentionally excluded.
    include: ['src/**/__tests__/**/*.test.{ts,tsx}'],
    testTimeout: 30000,
  },
});
