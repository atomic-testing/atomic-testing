import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { toolbarExample, toolbarExampleTestSuite } from '../src/examples';

testRunner(toolbarExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof toolbarExample.scene) => {
    return createTestEngine(toolbarExample.ui, scenePart);
  },
});
