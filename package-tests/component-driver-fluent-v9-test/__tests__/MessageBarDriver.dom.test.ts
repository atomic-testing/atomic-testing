import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { messageBarExample, messageBarExampleTestSuite } from '../src/examples';

testRunner(messageBarExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof messageBarExample.scene) => {
    return createTestEngine(messageBarExample.ui, scenePart);
  },
});
