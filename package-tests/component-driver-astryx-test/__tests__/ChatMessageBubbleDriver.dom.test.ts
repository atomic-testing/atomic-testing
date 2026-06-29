import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { chatMessageBubbleExample, chatMessageBubbleExampleTestSuite } from '../src/examples';

testRunner(chatMessageBubbleExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof chatMessageBubbleExample.scene) => {
    return createTestEngine(chatMessageBubbleExample.ui, scenePart);
  },
});
