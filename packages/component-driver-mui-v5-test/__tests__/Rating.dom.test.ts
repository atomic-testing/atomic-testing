import { jestTestAdapter } from '@atomic-testing/jest';
import { createTestEngine } from '@atomic-testing/react';
import { testRunner } from '@atomic-testing/test-runner';

import { basicRatingExample, ratingTestSuite } from '../src/examples';

testRunner(ratingTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicRatingExample.scene) => {
    return createTestEngine(basicRatingExample.ui, scenePart);
  },
});
