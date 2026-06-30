import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { markdownExample, markdownExampleTestSuite } from '../src/examples';

testRunner(markdownExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof markdownExample.scene) => {
    return createTestEngine(markdownExample.ui, scenePart);
  },
});
