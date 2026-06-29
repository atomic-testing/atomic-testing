import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { powerSearchExample, powerSearchExampleTestSuite } from '../src/examples';

testRunner(powerSearchExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof powerSearchExample.scene) => {
    return createTestEngine(powerSearchExample.ui, scenePart);
  },
});
