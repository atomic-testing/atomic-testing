import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { comboboxExample, comboboxExampleTestSuite } from '../src/examples';

testRunner(comboboxExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof comboboxExample.scene) => {
    return createTestEngine(comboboxExample.ui, scenePart);
  },
});
