import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { navIconExample, navIconExampleTestSuite } from '../src/examples';

testRunner(navIconExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof navIconExample.scene) => {
    return createTestEngine(navIconExample.ui, scenePart);
  },
});
