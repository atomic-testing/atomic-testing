import { defineConfig, devices } from '@playwright/test';

const baseUrl = 'http://localhost:3020';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './__tests__',
  testMatch: /.*\.e2e\.(test|spec)\.(ts|tsx)$/,
  /* Maximum time one test can run for. Astryx renders via StyleX, whose first
   * cold Vite compile is heavier than the html-test app — a generous per-test
   * timeout absorbs that without flaking. */
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  /* `list` (not `html`) — the html reporter starts a blocking report server that
   * hangs headless runs. */
  reporter: 'list',
  use: {
    actionTimeout: 0,
    baseURL: baseUrl,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  /* Auto-start/stop the Vite dev server (port 3020) so e2e gates run without a
   * manually-launched server. `reuseExistingServer` is off on CI to avoid a
   * stale process, kept locally so a dev server already on 3020 is reused. The
   * generous timeout absorbs Vite's cold first compile of Astryx + StyleX. */
  webServer: {
    command: 'pnpm start',
    timeout: 120 * 1000,
    url: baseUrl,
    reuseExistingServer: !process.env.CI,
  },
});
