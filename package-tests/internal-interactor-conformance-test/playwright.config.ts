import { defineConfig, devices } from '@playwright/test';

/**
 * The conformance e2e leg loads its fixture with `page.setContent`, so no dev
 * server / baseURL is needed — unlike the driver package-tests that serve React
 * examples through Vite.
 */

// CHROMIUM_EXECUTABLE lets sandboxed dev environments point at a preinstalled
// Chromium (mirroring package-tests/component-driver-mui-v9-test and siblings);
// CI and normal dev machines resolve the browsers through Playwright's
// registry (npx playwright install).
const executablePath = process.env.CHROMIUM_EXECUTABLE;

export default defineConfig({
  testDir: './__tests__',
  testMatch: /.*\.e2e\.(test|spec)\.(ts|tsx)$/,
  timeout: 10 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    actionTimeout: 0,
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
});
