import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { topNavMenuExample, topNavMenuExampleTestSuite } from '../src/examples';

testRunner(topNavMenuExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof topNavMenuExample.scene) => {
    return createTestEngine(topNavMenuExample.ui, scenePart);
  },
});
