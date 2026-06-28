import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-18';

import { basicAlertExample, basicAlertTestSuite } from '../src/examples';

testRunner(basicAlertTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicAlertExample.scene) => {
    return createTestEngine(basicAlertExample.ui, scenePart);
  },
});
