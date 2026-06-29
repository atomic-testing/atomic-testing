import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { fieldStatusExample, fieldStatusExampleTestSuite } from '../src/examples';

testRunner(fieldStatusExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof fieldStatusExample.scene) => {
    return createTestEngine(fieldStatusExample.ui, scenePart);
  },
});
