import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { textareaExample, textareaExampleTestSuite } from '../src/examples';

testRunner(textareaExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof textareaExample.scene) => {
    return createTestEngine(textareaExample.ui, scenePart);
  },
});
