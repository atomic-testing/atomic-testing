import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { tableExample, tableExampleTestSuite } from '../src/examples';

testRunner(tableExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof tableExample.scene) => {
    return createTestEngine(tableExample.ui, scenePart);
  },
});
