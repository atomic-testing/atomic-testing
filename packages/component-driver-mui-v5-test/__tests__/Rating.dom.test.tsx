import { testRunner } from '@atomic-testing/core';
import { createTestEngine } from '@atomic-testing/react';
import { basicRatingExample, ratingTestSuite } from '../src/examples/rating';
import { jestTestAdapter } from './jestTestAdapter';

testRunner(ratingTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicRatingExample.scene) => {
    return createTestEngine(basicRatingExample.ui, scenePart);
  },
});
