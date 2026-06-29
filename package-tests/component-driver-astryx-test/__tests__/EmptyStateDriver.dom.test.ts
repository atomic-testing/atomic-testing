import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { emptyStateExample, emptyStateExampleTestSuite } from '../src/examples';

testRunner(emptyStateExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof emptyStateExample.scene) => {
    return createTestEngine(emptyStateExample.ui, scenePart);
  },
});
