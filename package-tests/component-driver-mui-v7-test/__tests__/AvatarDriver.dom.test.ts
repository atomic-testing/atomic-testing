import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-18';

import { basicAvatarExample, basicAvatarTestSuite } from '../src/examples';

testRunner(basicAvatarTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicAvatarExample.scene) => {
    return createTestEngine(basicAvatarExample.ui, scenePart);
  },
});
