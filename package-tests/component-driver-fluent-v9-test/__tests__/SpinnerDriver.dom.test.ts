import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { spinnerExample, spinnerExampleTestSuite } from '../src/examples';

testRunner(spinnerExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof spinnerExample.scene) => {
    return createTestEngine(spinnerExample.ui, scenePart);
  },
});
