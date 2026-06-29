import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { progressBarExample, progressBarExampleTestSuite } from '../src/examples';

testRunner(progressBarExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof progressBarExample.scene) => {
    return createTestEngine(progressBarExample.ui, scenePart);
  },
});
