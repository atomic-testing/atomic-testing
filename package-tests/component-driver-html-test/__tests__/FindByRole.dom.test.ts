import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { findByRoleExample, findByRoleExampleTestSuite } from '../src/examples';

testRunner(findByRoleExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof findByRoleExample.scene) => {
    return createTestEngine(findByRoleExample.ui, scenePart);
  },
});
