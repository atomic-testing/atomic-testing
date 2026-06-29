import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { chatComposerExample, chatComposerExampleTestSuite } from '../src/examples';

testRunner(chatComposerExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof chatComposerExample.scene) => {
    return createTestEngine(chatComposerExample.ui, scenePart);
  },
});
