import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { timeInputExample, timeInputExampleTestSuite } from '../src/examples';

testRunner(timeInputExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof timeInputExample.scene) => {
    return createTestEngine(timeInputExample.ui, scenePart);
  },
});
