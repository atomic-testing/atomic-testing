import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { skeletonExample, skeletonExampleTestSuite } from '../src/examples';

testRunner(skeletonExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof skeletonExample.scene) => {
    return createTestEngine(skeletonExample.ui, scenePart);
  },
});
