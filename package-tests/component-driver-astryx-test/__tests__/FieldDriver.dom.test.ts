import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { fieldExample, fieldExampleTestSuite } from '../src/examples';

testRunner(fieldExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof fieldExample.scene) => {
    return createTestEngine(fieldExample.ui, scenePart);
  },
});
