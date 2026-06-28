import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { toggleButtonGroupExample, toggleButtonGroupExampleTestSuite } from '../src/examples';

testRunner(toggleButtonGroupExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof toggleButtonGroupExample.scene) => {
    return createTestEngine(toggleButtonGroupExample.ui, scenePart);
  },
});
