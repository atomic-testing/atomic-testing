import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { topNavItemExample, topNavItemExampleTestSuite } from '../src/examples';

testRunner(topNavItemExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof topNavItemExample.scene) => {
    return createTestEngine(topNavItemExample.ui, scenePart);
  },
});
