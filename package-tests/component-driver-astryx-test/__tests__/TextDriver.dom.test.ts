import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { textExample, textExampleTestSuite } from '../src/examples';

testRunner(textExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof textExample.scene) => {
    return createTestEngine(textExample.ui, scenePart);
  },
});
