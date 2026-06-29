import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { tokenExample, tokenExampleTestSuite } from '../src/examples';

testRunner(tokenExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof tokenExample.scene) => {
    return createTestEngine(tokenExample.ui, scenePart);
  },
});
