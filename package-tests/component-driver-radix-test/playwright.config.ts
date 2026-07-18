import { defineConfig, devices } from '@playwright/test';

const baseUrl = 'http://localhost:3030';

// CHROMIUM_EXECUTABLE lets sandboxed dev environments point at a preinstalled
// Chromium (mirroring package-tests/component-driver-astryx-test and the
// Angular Material package-tests); CI and normal dev machines resolve the
// browsers through Playwright's registry (npx playwright install).
const executablePath = process.env.CHROMIUM_EXECUTABLE;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './__tests__',
  testMatch: /.*\.e2e\.(test|spec)\.(ts|tsx)$/,
  /* Maximum time one test can run for — generous enough to absorb Vite's cold
   * first compile without flaking. */
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
      use: { ...devices['Desktop Chrome'], ...(executablePath ? { launchOptions: { executablePath } } : {}) },
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

  /* Auto-start/stop the Vite dev server (port 3030) so e2e gates run without a
   * manually-launched server. `reuseExistingServer` is off on CI to avoid a
   * stale process, kept locally so a dev server already on 3030 is reused. */
  webServer: {
    command: 'pnpm start',
    timeout: 120 * 1000,
    url: baseUrl,
    reuseExistingServer: !process.env.CI,
  },
});
