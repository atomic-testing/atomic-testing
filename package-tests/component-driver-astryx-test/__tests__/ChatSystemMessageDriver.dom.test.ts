import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { chatSystemMessageExample, chatSystemMessageExampleTestSuite } from '../src/examples';

testRunner(chatSystemMessageExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof chatSystemMessageExample.scene) => {
    return createTestEngine(chatSystemMessageExample.ui, scenePart);
  },
});
