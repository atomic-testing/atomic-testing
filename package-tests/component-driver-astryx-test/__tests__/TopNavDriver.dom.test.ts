import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { topNavExample, topNavExampleTestSuite } from '../src/examples';

testRunner(topNavExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof topNavExample.scene) => {
    return createTestEngine(topNavExample.ui, scenePart);
  },
});
