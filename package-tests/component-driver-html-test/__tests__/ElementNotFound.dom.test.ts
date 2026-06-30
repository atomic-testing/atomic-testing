import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { elementNotFoundExample, elementNotFoundTestSuite } from '../src/examples';

testRunner(elementNotFoundTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof elementNotFoundExample.scene) => {
    return createTestEngine(elementNotFoundExample.ui, scenePart);
  },
});
