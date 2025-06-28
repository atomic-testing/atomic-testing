import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-18';

import { basicDataGridProExample, basicDataGridProTestSuite } from '../src/examples';

testRunner(basicDataGridProTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicDataGridProExample.scene) => {
    return createTestEngine(basicDataGridProExample.ui, scenePart);
  },
});
