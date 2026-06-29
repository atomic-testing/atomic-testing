import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { avatarExample, avatarExampleTestSuite } from '../src/examples';

testRunner(avatarExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof avatarExample.scene) => {
    return createTestEngine(avatarExample.ui, scenePart);
  },
});
