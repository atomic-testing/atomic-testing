import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-18';

import { basicInputExample, basicInputTestSuite } from '../src/examples';

testRunner(basicInputTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicInputExample.scene) => {
    return createTestEngine(basicInputExample.ui, scenePart);
  },
});
