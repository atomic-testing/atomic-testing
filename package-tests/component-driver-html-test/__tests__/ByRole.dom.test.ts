import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { byRoleExample, byRoleExampleTestSuite } from '../src/examples';

testRunner(byRoleExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof byRoleExample.scene) => {
    return createTestEngine(byRoleExample.ui, scenePart);
  },
});
