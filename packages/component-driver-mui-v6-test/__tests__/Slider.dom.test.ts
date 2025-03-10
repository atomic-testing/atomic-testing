import { jestTestAdapter } from '@atomic-testing/jest';
import { createTestEngine } from '@atomic-testing/react';
import { testRunner } from '@atomic-testing/test-runner';
import { basicSliderExample, basicSliderTestSuite } from '../src/examples';

testRunner(basicSliderTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicSliderExample.scene) => {
    return createTestEngine(basicSliderExample.ui, scenePart);
  },
});
