import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { linkExample, linkExampleTestSuite } from '../src/examples';

testRunner(linkExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof linkExample.scene) => {
    return createTestEngine(linkExample.ui, scenePart);
  },
});
