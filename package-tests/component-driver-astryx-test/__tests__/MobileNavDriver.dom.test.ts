import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { mobileNavExample, mobileNavExampleTestSuite } from '../src/examples';

testRunner(mobileNavExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof mobileNavExample.scene) => {
    return createTestEngine(mobileNavExample.ui, scenePart);
  },
});
