import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { avatarGroupExample, avatarGroupExampleTestSuite } from '../src/examples';

testRunner(avatarGroupExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof avatarGroupExample.scene) => {
    return createTestEngine(avatarGroupExample.ui, scenePart);
  },
});
