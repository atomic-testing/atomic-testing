import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { checkboxListExample, checkboxListExampleTestSuite } from '../src/examples';

testRunner(checkboxListExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof checkboxListExample.scene) => {
    return createTestEngine(checkboxListExample.ui, scenePart);
  },
});
