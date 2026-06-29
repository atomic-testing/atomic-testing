import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { radioListExample, radioListExampleTestSuite } from '../src/examples';

testRunner(radioListExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof radioListExample.scene) => {
    return createTestEngine(radioListExample.ui, scenePart);
  },
});
