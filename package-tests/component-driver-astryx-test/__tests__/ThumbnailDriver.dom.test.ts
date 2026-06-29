import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { thumbnailExample, thumbnailExampleTestSuite } from '../src/examples';

testRunner(thumbnailExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof thumbnailExample.scene) => {
    return createTestEngine(thumbnailExample.ui, scenePart);
  },
});
