import { jestTestAdapter } from '@atomic-testing/jest';
import { createTestEngine } from '@atomic-testing/react';
import { testRunner } from '@atomic-testing/test-runner';

import { basicDataGridProExample, basicDataGridProTestSuite } from '../src/examples';

testRunner(basicDataGridProTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicDataGridProExample.scene) => {
    return createTestEngine(basicDataGridProExample.ui, scenePart);
  },
});
