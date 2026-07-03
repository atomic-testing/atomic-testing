import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { tabsExample, tabsExampleTestSuite } from '../src/examples';

testRunner(tabsExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof tabsExample.scene) => {
    return createTestEngine(tabsExample.ui, scenePart);
  },
});
