import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { buttonGroupExample, buttonGroupExampleTestSuite } from '../src/examples';

testRunner(buttonGroupExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof buttonGroupExample.scene) => {
    return createTestEngine(buttonGroupExample.ui, scenePart);
  },
});
