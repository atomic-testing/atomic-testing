import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-18';

import { basicPaginationExample, basicPaginationTestSuite } from '../src/examples';

testRunner(basicPaginationTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicPaginationExample.scene) => {
    return createTestEngine(basicPaginationExample.ui, scenePart);
  },
});
