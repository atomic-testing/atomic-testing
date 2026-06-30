import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { itemExample, itemExampleTestSuite } from '../src/examples';

testRunner(itemExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof itemExample.scene) => {
    return createTestEngine(itemExample.ui, scenePart);
  },
});
