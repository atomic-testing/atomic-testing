import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { aspectRatioExample, aspectRatioExampleTestSuite } from '../src/examples';

testRunner(aspectRatioExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof aspectRatioExample.scene) => {
    return createTestEngine(aspectRatioExample.ui, scenePart);
  },
});
