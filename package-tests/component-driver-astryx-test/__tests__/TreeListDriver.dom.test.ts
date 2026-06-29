import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { treeListExample, treeListExampleTestSuite } from '../src/examples';

testRunner(treeListExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof treeListExample.scene) => {
    return createTestEngine(treeListExample.ui, scenePart);
  },
});
