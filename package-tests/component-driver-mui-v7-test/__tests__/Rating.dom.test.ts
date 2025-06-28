import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-18';

import { basicRatingExample, ratingTestSuite } from '../src/examples';

testRunner(ratingTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicRatingExample.scene) => {
    return createTestEngine(basicRatingExample.ui, scenePart);
  },
});
