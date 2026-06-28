import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { simpleTreeViewExample, simpleTreeViewTestSuite } from '../src/examples';

testRunner(simpleTreeViewTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof simpleTreeViewExample.scene) => {
    return createTestEngine(simpleTreeViewExample.ui, scenePart);
  },
});
