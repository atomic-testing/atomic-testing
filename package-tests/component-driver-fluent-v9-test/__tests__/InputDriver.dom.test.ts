import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { inputExample, inputExampleTestSuite } from '../src/examples';

testRunner(inputExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof inputExample.scene) => {
    return createTestEngine(inputExample.ui, scenePart);
  },
});
