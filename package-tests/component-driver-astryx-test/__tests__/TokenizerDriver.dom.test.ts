import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { tokenizerExample, tokenizerExampleTestSuite } from '../src/examples';

testRunner(tokenizerExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof tokenizerExample.scene) => {
    return createTestEngine(tokenizerExample.ui, scenePart);
  },
});
