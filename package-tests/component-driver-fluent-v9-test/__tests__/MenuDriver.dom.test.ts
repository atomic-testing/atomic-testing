import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { menuExample, menuExampleTestSuite } from '../src/examples';

testRunner(menuExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof menuExample.scene) => {
    return createTestEngine(menuExample.ui, scenePart);
  },
});
