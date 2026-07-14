import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { toggleButtonExample, toggleButtonExampleTestSuite } from '../src/examples';

testRunner(toggleButtonExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof toggleButtonExample.scene) => {
    return createTestEngine(toggleButtonExample.ui, scenePart);
  },
});
