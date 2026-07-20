import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { alertExample, alertExampleTestSuite } from '../src/examples';

testRunner(alertExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof alertExample.scene) => {
    return createTestEngine(alertExample.ui, scenePart);
  },
});
