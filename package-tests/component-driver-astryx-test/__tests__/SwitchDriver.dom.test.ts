import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { switchControlExample, switchControlExampleTestSuite } from '../src/examples';

testRunner(switchControlExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof switchControlExample.scene) => {
    return createTestEngine(switchControlExample.ui, scenePart);
  },
});
