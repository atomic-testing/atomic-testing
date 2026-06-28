import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { dragExample, dragExampleTestSuite } from '../src/examples';

testRunner(dragExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof dragExample.scene) => {
    return createTestEngine(dragExample.ui, scenePart);
  },
});
