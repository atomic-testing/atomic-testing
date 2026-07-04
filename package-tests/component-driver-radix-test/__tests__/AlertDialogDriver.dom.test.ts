import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { alertDialogExample, alertDialogExampleTestSuite } from '../src/examples';

testRunner(alertDialogExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof alertDialogExample.scene) => {
    return createTestEngine(alertDialogExample.ui, scenePart);
  },
});
