import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { chatToolCallsExample, chatToolCallsExampleTestSuite } from '../src/examples';

testRunner(chatToolCallsExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof chatToolCallsExample.scene) => {
    return createTestEngine(chatToolCallsExample.ui, scenePart);
  },
});
