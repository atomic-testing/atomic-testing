import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { moreMenuExample, moreMenuExampleTestSuite } from '../src/examples';

testRunner(moreMenuExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof moreMenuExample.scene) => {
    return createTestEngine(moreMenuExample.ui, scenePart);
  },
});
