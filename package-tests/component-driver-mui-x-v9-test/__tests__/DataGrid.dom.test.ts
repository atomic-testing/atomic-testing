import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { basicDataGridPremiumExample, basicDataGridPremiumTestSuite } from '../src/examples';

testRunner(basicDataGridPremiumTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicDataGridPremiumExample.scene) => {
    return createTestEngine(basicDataGridPremiumExample.ui, scenePart);
  },
});
