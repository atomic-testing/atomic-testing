import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { radioExample, radioExampleTestSuite } from '../src/examples';

testRunner(radioExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof radioExample.scene) => {
    return createTestEngine(radioExample.ui, scenePart);
  },
});
