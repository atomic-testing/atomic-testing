import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { navigationMenuExample, navigationMenuExampleTestSuite } from '../src/examples';

testRunner(navigationMenuExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof navigationMenuExample.scene) => {
    return createTestEngine(navigationMenuExample.ui, scenePart);
  },
});
