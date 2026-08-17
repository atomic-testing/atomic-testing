import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { complexSelectorExample, complexSelectorExampleTestSuite } from '../src/examples';

testRunner(complexSelectorExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof complexSelectorExample.scene) => {
    return createTestEngine(complexSelectorExample.ui, scenePart);
  },
});
