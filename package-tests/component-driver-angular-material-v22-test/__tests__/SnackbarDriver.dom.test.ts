import { createTestEngine } from '@atomic-testing/angular-22';
import { testRunner } from '@atomic-testing/internal-test-runner';
import { vitestAdapter } from '@atomic-testing/internal-test-runner-vitest-adapter';

import { SnackbarExampleComponent } from '../src/examples/snackbar/Snackbar.examples';
import { snackbarScenePart, snackbarTestSuite } from '../src/examples/snackbar/Snackbar.suite';

testRunner(snackbarTestSuite, vitestAdapter, {
  // Cap the settle step well below the timed snackbar's 500ms duration: under
  // zone.js the duration timer is an in-zone macrotask, so whenStable() (the
  // default settle) would not resolve until the snackbar has already
  // auto-dismissed — the click that opened it would "settle" past the very
  // state the test needs to observe. The suite's own waitFor* probes absorb
  // any change detection still in flight.
  getTestEngine: (scenePart: typeof snackbarScenePart) =>
    createTestEngine(SnackbarExampleComponent, scenePart, { settleTimeoutMs: 250 }),
});
