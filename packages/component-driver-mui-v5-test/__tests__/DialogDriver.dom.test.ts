import { jestTestAdapter } from '@atomic-testing/jest';
import { createTestEngine } from '@atomic-testing/react';
import { testRunner } from '@atomic-testing/test-runner';
import { alertDialogExample } from '../src/examples';
import { alertDialogTestSuite } from '../src/examples/dialog/AlertDialog.examples';

testRunner(alertDialogTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof alertDialogExample.scene) => {
    return createTestEngine(alertDialogExample.ui, scenePart);
  },
});
