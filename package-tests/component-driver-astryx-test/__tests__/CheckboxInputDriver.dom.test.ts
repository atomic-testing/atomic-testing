import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { checkboxInputExample, checkboxInputExampleTestSuite } from '../src/examples';

testRunner(checkboxInputExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof checkboxInputExample.scene) => {
    return createTestEngine(checkboxInputExample.ui, scenePart);
  },
});
