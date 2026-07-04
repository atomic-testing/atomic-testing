import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { dialogExample, dialogExampleTestSuite } from '../src/examples';

testRunner(dialogExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof dialogExample.scene) => {
    return createTestEngine(dialogExample.ui, scenePart);
  },
});
