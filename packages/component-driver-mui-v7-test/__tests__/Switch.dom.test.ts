import { jestTestAdapter } from '@atomic-testing/jest';
import { createTestEngine } from '@atomic-testing/react';
import { testRunner } from '@atomic-testing/test-runner';

import { basicSwitchExample, basicSwitchTestSuite } from '../src/examples';

testRunner(basicSwitchTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicSwitchExample.scene) => {
    return createTestEngine(basicSwitchExample.ui, scenePart);
  },
});
