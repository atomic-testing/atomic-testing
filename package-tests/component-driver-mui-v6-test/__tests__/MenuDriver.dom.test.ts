import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-18';

import { accountMenuExample, accountMenuTestSuite } from '../src/examples';

testRunner(accountMenuTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof accountMenuExample.scene) => {
    return createTestEngine(accountMenuExample.ui, scenePart);
  },
});
