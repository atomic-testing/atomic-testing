import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { sideNavItemExample, sideNavItemExampleTestSuite } from '../src/examples';

testRunner(sideNavItemExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof sideNavItemExample.scene) => {
    return createTestEngine(sideNavItemExample.ui, scenePart);
  },
});
