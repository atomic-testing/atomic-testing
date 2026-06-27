import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-18';

import { basicTabsExample, basicTabsTestSuite } from '../src/examples';

testRunner(basicTabsTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicTabsExample.scene) => {
    return createTestEngine(basicTabsExample.ui, scenePart);
  },
});
