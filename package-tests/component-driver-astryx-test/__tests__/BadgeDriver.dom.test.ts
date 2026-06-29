import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { badgeExample, badgeExampleTestSuite } from '../src/examples';

testRunner(badgeExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof badgeExample.scene) => {
    return createTestEngine(badgeExample.ui, scenePart);
  },
});
