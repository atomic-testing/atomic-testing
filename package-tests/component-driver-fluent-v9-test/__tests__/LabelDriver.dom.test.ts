import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { labelExample, labelExampleTestSuite } from '../src/examples';

testRunner(labelExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof labelExample.scene) => {
    return createTestEngine(labelExample.ui, scenePart);
  },
});
