import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { chatDictationButtonExample, chatDictationButtonExampleTestSuite } from '../src/examples';

testRunner(chatDictationButtonExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof chatDictationButtonExample.scene) => {
    return createTestEngine(chatDictationButtonExample.ui, scenePart);
  },
});
