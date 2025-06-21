import { jestTestAdapter } from '@atomic-testing/jest';
import { createTestEngine } from '@atomic-testing/react-18';
import { testRunner } from '@atomic-testing/test-runner';

import { basicProgressExample, progressTestSuite } from '../src/examples';

testRunner(progressTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicProgressExample.scene) => {
    return createTestEngine(basicProgressExample.ui, scenePart);
  },
});
