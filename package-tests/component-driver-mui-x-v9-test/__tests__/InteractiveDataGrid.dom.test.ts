import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { interactiveDataGridPremiumExample, interactiveDataGridPremiumTestSuite } from '../src/examples';

testRunner(interactiveDataGridPremiumTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof interactiveDataGridPremiumExample.scene) => {
    return createTestEngine(interactiveDataGridPremiumExample.ui, scenePart);
  },
});
