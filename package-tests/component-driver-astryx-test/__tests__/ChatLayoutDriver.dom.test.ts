import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { chatLayoutExample, chatLayoutExampleTestSuite } from '../src/examples';

testRunner(chatLayoutExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof chatLayoutExample.scene) => {
    return createTestEngine(chatLayoutExample.ui, scenePart);
  },
});
