import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { popoverExample, popoverExampleTestSuite } from '../src/examples';

testRunner(popoverExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof popoverExample.scene) => {
    return createTestEngine(popoverExample.ui, scenePart);
  },
});
