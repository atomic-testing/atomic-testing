import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-18';
import { testRunner } from '@atomic-testing/internal-test-runner';

import { basicProgressExample, progressTestSuite } from '../src/examples';

testRunner(progressTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicProgressExample.scene) => {
    return createTestEngine(basicProgressExample.ui, scenePart);
  },
});
