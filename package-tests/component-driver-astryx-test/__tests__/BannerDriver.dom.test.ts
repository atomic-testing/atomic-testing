import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { bannerExample, bannerExampleTestSuite } from '../src/examples';

testRunner(bannerExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof bannerExample.scene) => {
    return createTestEngine(bannerExample.ui, scenePart);
  },
});
