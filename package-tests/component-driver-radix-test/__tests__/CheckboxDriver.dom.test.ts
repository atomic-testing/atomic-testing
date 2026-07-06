import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { checkboxExample, checkboxExampleTestSuite } from '../src/examples';

testRunner(checkboxExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof checkboxExample.scene) => {
    return createTestEngine(checkboxExample.ui, scenePart);
  },
});
