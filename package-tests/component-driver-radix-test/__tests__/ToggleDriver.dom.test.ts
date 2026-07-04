import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { toggleExample, toggleExampleTestSuite } from '../src/examples';

testRunner(toggleExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof toggleExample.scene) => {
    return createTestEngine(toggleExample.ui, scenePart);
  },
});
