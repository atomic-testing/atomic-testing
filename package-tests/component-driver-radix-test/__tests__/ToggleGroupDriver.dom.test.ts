import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { toggleGroupExample, toggleGroupExampleTestSuite } from '../src/examples';

testRunner(toggleGroupExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof toggleGroupExample.scene) => {
    return createTestEngine(toggleGroupExample.ui, scenePart);
  },
});
