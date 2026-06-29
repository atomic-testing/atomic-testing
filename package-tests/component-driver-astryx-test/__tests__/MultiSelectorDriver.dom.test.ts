import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { multiSelectorExample, multiSelectorExampleTestSuite } from '../src/examples';

testRunner(multiSelectorExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof multiSelectorExample.scene) => {
    return createTestEngine(multiSelectorExample.ui, scenePart);
  },
});
