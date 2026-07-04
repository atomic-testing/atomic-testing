import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { progressExample, progressExampleTestSuite } from '../src/examples';

testRunner(progressExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof progressExample.scene) => {
    return createTestEngine(progressExample.ui, scenePart);
  },
});
