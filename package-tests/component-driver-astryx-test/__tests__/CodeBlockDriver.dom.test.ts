import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { codeBlockExample, codeBlockExampleTestSuite } from '../src/examples';

testRunner(codeBlockExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof codeBlockExample.scene) => {
    return createTestEngine(codeBlockExample.ui, scenePart);
  },
});
