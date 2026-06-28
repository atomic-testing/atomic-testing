import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-18';

import { basicSnackbarExample, basicSnackbarTestSuite } from '../src/examples';

testRunner(basicSnackbarTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicSnackbarExample.scene) => {
    return createTestEngine(basicSnackbarExample.ui, scenePart);
  },
});
