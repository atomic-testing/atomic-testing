import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const dirname = path.dirname(fileURLToPath(import.meta.url));

// CHROMIUM_EXECUTABLE lets sandboxed dev environments point at a preinstalled
// Chromium; CI and normal dev machines resolve the browser through Playwright's
// registry (npx playwright install chromium).
const executablePath = process.env.CHROMIUM_EXECUTABLE;

export default defineConfig({
  plugins: [
    storybookTest({
      configDir: path.join(dirname, '.storybook'),
    }),
  ],
  test: {
    name: 'storybook',
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(executablePath ? { launchOptions: { executablePath } } : {}),
      instances: [{ browser: 'chromium' }],
    },
  },
});
