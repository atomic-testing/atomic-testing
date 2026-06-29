import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { chatSendButtonExample, chatSendButtonExampleTestSuite } from '../src/examples';

testRunner(chatSendButtonExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof chatSendButtonExample.scene) => {
    return createTestEngine(chatSendButtonExample.ui, scenePart);
  },
});
