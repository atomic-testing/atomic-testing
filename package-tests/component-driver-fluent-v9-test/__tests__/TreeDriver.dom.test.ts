import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { treeExample, treeExampleTestSuite } from '../src/examples';

testRunner(treeExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof treeExample.scene) => {
    return createTestEngine(treeExample.ui, scenePart);
  },
});
