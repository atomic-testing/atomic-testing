import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { textAreaExample, textAreaExampleTestSuite } from '../src/examples';

testRunner(textAreaExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof textAreaExample.scene) => {
    return createTestEngine(textAreaExample.ui, scenePart);
  },
});
