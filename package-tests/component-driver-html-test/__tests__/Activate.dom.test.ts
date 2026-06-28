import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { activateExample, activateExampleTestSuite } from '../src/examples';

testRunner(activateExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof activateExample.scene) => {
    return createTestEngine(activateExample.ui, scenePart);
  },
});
