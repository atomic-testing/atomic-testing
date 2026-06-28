import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { keyboardEventExample, keyboardEventExampleTestSuite } from '../src/examples';

testRunner(keyboardEventExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof keyboardEventExample.scene) => {
    return createTestEngine(keyboardEventExample.ui, scenePart);
  },
});
