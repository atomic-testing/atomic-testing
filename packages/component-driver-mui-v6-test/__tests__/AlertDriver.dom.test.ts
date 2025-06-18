import { jestTestAdapter } from '@atomic-testing/jest';
import { createTestEngine } from '@atomic-testing/react-18';
import { testRunner } from '@atomic-testing/test-runner';

import { basicAlertExample, basicAlertTestSuite } from '../src/examples';

testRunner(basicAlertTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicAlertExample.scene) => {
    return createTestEngine(basicAlertExample.ui, scenePart);
  },
});
