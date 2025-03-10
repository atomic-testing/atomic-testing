import { jestTestAdapter } from '@atomic-testing/jest';
import { createTestEngine } from '@atomic-testing/react';
import { testRunner } from '@atomic-testing/test-runner';
import { basicInputExample, basicInputTestSuite } from '../src/examples';

testRunner(basicInputTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicInputExample.scene) => {
    return createTestEngine(basicInputExample.ui, scenePart);
  },
});
