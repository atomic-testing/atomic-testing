import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { chatMessageListExample, chatMessageListExampleTestSuite } from '../src/examples';

testRunner(chatMessageListExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof chatMessageListExample.scene) => {
    return createTestEngine(chatMessageListExample.ui, scenePart);
  },
});
