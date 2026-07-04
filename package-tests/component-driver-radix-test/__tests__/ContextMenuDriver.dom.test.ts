import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { contextMenuExample, contextMenuExampleTestSuite } from '../src/examples';

testRunner(contextMenuExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof contextMenuExample.scene) => {
    return createTestEngine(contextMenuExample.ui, scenePart);
  },
});
