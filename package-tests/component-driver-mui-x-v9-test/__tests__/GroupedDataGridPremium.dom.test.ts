import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { groupedDataGridPremiumExample, groupedDataGridPremiumTestSuite } from '../src/examples';

testRunner(groupedDataGridPremiumTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof groupedDataGridPremiumExample.scene) => {
    return createTestEngine(groupedDataGridPremiumExample.ui, scenePart);
  },
});
