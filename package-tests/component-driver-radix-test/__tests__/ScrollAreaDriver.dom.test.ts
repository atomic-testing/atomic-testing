import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { scrollAreaExample, scrollAreaExampleTestSuite } from '../src/examples';

testRunner(scrollAreaExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof scrollAreaExample.scene) => {
    return createTestEngine(scrollAreaExample.ui, scenePart);
  },
});
