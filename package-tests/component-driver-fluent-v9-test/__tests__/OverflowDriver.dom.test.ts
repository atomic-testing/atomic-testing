import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { overflowExample, overflowExampleTestSuite } from '../src/examples';

testRunner(overflowExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof overflowExample.scene) => {
    return createTestEngine(overflowExample.ui, scenePart);
  },
});
