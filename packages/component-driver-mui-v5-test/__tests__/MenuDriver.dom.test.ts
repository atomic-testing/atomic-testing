import { jestTestAdapter } from '@atomic-testing/jest';
import { createTestEngine } from '@atomic-testing/react';
import { testRunner } from '@atomic-testing/test-runner';
import { accountMenuExample, accountMenuTestSuite } from '../src/examples';

testRunner(accountMenuTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof accountMenuExample.scene) => {
    return createTestEngine(accountMenuExample.ui, scenePart);
  },
});
