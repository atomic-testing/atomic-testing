import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { paginationExample, paginationExampleTestSuite } from '../src/examples';

testRunner(paginationExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof paginationExample.scene) => {
    return createTestEngine(paginationExample.ui, scenePart);
  },
});
