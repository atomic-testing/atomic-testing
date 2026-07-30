import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { masterDetailDataGridPremiumExample, masterDetailDataGridPremiumTestSuite } from '../src/examples';

testRunner(masterDetailDataGridPremiumTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof masterDetailDataGridPremiumExample.scene) => {
    return createTestEngine(masterDetailDataGridPremiumExample.ui, scenePart);
  },
});
