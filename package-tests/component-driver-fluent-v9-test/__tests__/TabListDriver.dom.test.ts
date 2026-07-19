import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { tabListExample, tabListExampleTestSuite } from '../src/examples';

testRunner(tabListExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof tabListExample.scene) => {
    return createTestEngine(tabListExample.ui, scenePart);
  },
});
