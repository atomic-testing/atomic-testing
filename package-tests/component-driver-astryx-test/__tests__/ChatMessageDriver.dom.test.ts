import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { chatMessageExample, chatMessageExampleTestSuite } from '../src/examples';

testRunner(chatMessageExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof chatMessageExample.scene) => {
    return createTestEngine(chatMessageExample.ui, scenePart);
  },
});
