import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { sliderExample, sliderExampleTestSuite } from '../src/examples';

testRunner(sliderExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof sliderExample.scene) => {
    return createTestEngine(sliderExample.ui, scenePart);
  },
});
