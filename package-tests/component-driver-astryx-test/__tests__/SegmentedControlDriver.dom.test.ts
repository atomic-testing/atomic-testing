import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { segmentedControlExample, segmentedControlExampleTestSuite } from '../src/examples';

testRunner(segmentedControlExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof segmentedControlExample.scene) => {
    return createTestEngine(segmentedControlExample.ui, scenePart);
  },
});
