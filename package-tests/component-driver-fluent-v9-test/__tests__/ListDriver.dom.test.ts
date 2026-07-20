import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { listExample, listExampleTestSuite } from '../src/examples';

testRunner(listExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof listExample.scene) => {
    return createTestEngine(listExample.ui, scenePart);
  },
});
