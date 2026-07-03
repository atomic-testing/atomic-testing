import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { oneTimePasswordFieldExample, oneTimePasswordFieldExampleTestSuite } from '../src/examples';

testRunner(oneTimePasswordFieldExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof oneTimePasswordFieldExample.scene) => {
    return createTestEngine(oneTimePasswordFieldExample.ui, scenePart);
  },
});
