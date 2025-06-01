import { jestTestAdapter } from '@atomic-testing/jest';
import { createTestEngine } from '@atomic-testing/react';
import { testRunner } from '@atomic-testing/test-runner';

import { basicBadgeExample, basicBadgeTestSuite } from '../src/examples';

testRunner(basicBadgeTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicBadgeExample.scene) => {
    return createTestEngine(basicBadgeExample.ui, scenePart);
  },
});
