import { jestTestAdapter } from '@atomic-testing/jest';
import { createTestEngine } from '@atomic-testing/react-18';
import { testRunner } from '@atomic-testing/test-runner';

import { basicSnackbarExample, basicSnackbarTestSuite } from '../src/examples';

testRunner(basicSnackbarTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicSnackbarExample.scene) => {
    return createTestEngine(basicSnackbarExample.ui, scenePart);
  },
});
