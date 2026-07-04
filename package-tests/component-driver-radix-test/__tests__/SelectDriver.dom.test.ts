import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { selectExample, selectExampleTestSuite } from '../src/examples';

testRunner(selectExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof selectExample.scene) => {
    return createTestEngine(selectExample.ui, scenePart);
  },
});
