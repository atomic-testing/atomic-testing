import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-18';

import { basicTablePaginationExample, basicTablePaginationTestSuite } from '../src/examples';

testRunner(basicTablePaginationTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicTablePaginationExample.scene) => {
    return createTestEngine(basicTablePaginationExample.ui, scenePart);
  },
});
