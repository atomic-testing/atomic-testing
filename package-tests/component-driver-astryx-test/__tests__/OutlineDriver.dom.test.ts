import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { outlineExample, outlineExampleTestSuite } from '../src/examples';

testRunner(outlineExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof outlineExample.scene) => {
    return createTestEngine(outlineExample.ui, scenePart);
  },
});
