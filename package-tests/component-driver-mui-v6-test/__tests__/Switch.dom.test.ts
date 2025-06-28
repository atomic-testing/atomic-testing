import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-18';

import { basicSwitchExample, basicSwitchTestSuite } from '../src/examples';

testRunner(basicSwitchTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicSwitchExample.scene) => {
    return createTestEngine(basicSwitchExample.ui, scenePart);
  },
});
