import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-18';

import { basicBadgeExample, basicBadgeTestSuite } from '../src/examples';

testRunner(basicBadgeTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicBadgeExample.scene) => {
    return createTestEngine(basicBadgeExample.ui, scenePart);
  },
});
