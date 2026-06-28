import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { buttonExample, buttonExampleTestSuite } from '../src/examples';

testRunner(buttonExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof buttonExample.scene) => {
    return createTestEngine(buttonExample.ui, scenePart);
  },
});
