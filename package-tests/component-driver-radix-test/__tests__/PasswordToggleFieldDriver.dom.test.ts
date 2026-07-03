import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { passwordToggleFieldExample, passwordToggleFieldExampleTestSuite } from '../src/examples';

testRunner(passwordToggleFieldExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof passwordToggleFieldExample.scene) => {
    return createTestEngine(passwordToggleFieldExample.ui, scenePart);
  },
});
