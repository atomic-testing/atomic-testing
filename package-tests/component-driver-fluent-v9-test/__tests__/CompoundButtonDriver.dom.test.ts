import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { compoundButtonExample, compoundButtonExampleTestSuite } from '../src/examples';

testRunner(compoundButtonExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof compoundButtonExample.scene) => {
    return createTestEngine(compoundButtonExample.ui, scenePart);
  },
});
