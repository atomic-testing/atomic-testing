import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// https://vitest.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    // Only the atomic-testing component tests. Playwright specs under /e2e are
    // intentionally excluded — they run through the Playwright runner instead.
    include: ['src/**/__tests__/**/*.test.{ts,tsx}'],
    testTimeout: 30000,
  },
});
