import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { timestampExample, timestampExampleTestSuite } from '../src/examples';

testRunner(timestampExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof timestampExample.scene) => {
    return createTestEngine(timestampExample.ui, scenePart);
  },
});
