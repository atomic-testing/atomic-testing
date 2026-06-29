import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { navMenuExample, navMenuExampleTestSuite } from '../src/examples';

testRunner(navMenuExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof navMenuExample.scene) => {
    return createTestEngine(navMenuExample.ui, scenePart);
  },
});
