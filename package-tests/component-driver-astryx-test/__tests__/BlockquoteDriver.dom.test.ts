import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { blockquoteExample, blockquoteExampleTestSuite } from '../src/examples';

testRunner(blockquoteExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof blockquoteExample.scene) => {
    return createTestEngine(blockquoteExample.ui, scenePart);
  },
});
