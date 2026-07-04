import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { separatorExample, separatorExampleTestSuite } from '../src/examples';

testRunner(separatorExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof separatorExample.scene) => {
    return createTestEngine(separatorExample.ui, scenePart);
  },
});
