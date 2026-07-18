import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { ratingExample, ratingExampleTestSuite } from '../src/examples';

testRunner(ratingExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof ratingExample.scene) => {
    return createTestEngine(ratingExample.ui, scenePart);
  },
});
