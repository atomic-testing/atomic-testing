import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { menubarExample, menubarExampleTestSuite } from '../src/examples';

testRunner(menubarExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof menubarExample.scene) => {
    return createTestEngine(menubarExample.ui, scenePart);
  },
});
