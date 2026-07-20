import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { dataGridExample, dataGridExampleTestSuite } from '../src/examples';

testRunner(dataGridExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof dataGridExample.scene) => {
    return createTestEngine(dataGridExample.ui, scenePart);
  },
});
