import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { collapsibleExample, collapsibleExampleTestSuite } from '../src/examples';

testRunner(collapsibleExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof collapsibleExample.scene) => {
    return createTestEngine(collapsibleExample.ui, scenePart);
  },
});
