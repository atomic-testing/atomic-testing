import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { drawerExample, drawerExampleTestSuite } from '../src/examples';

testRunner(drawerExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof drawerExample.scene) => {
    return createTestEngine(drawerExample.ui, scenePart);
  },
});
