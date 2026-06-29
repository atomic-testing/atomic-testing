import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { selectorExample, selectorExampleTestSuite } from '../src/examples';

testRunner(selectorExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof selectorExample.scene) => {
    return createTestEngine(selectorExample.ui, scenePart);
  },
});
