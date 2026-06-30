import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { appShellExample, appShellExampleTestSuite } from '../src/examples';

testRunner(appShellExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof appShellExample.scene) => {
    return createTestEngine(appShellExample.ui, scenePart);
  },
});
