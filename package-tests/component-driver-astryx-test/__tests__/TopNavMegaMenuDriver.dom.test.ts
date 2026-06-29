import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { topNavMegaMenuExample, topNavMegaMenuExampleTestSuite } from '../src/examples';

testRunner(topNavMegaMenuExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof topNavMegaMenuExample.scene) => {
    return createTestEngine(topNavMegaMenuExample.ui, scenePart);
  },
});
