import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { navExample, navExampleTestSuite } from '../src/examples';

testRunner(navExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof navExample.scene) => {
    return createTestEngine(navExample.ui, scenePart);
  },
});
