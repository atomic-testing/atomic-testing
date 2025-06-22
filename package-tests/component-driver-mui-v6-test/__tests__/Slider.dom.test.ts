import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-18';
import { testRunner } from '@atomic-testing/internal-test-runner';

import { basicSliderExample, basicSliderTestSuite } from '../src/examples';

testRunner(basicSliderTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicSliderExample.scene) => {
    return createTestEngine(basicSliderExample.ui, scenePart);
  },
});
