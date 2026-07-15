import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { toastExample, toastExampleTestSuite } from '../src/examples';

testRunner(toastExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof toastExample.scene) => {
    return createTestEngine(toastExample.ui, scenePart);
  },
});
