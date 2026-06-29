import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { statusDotExample, statusDotExampleTestSuite } from '../src/examples';

testRunner(statusDotExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof statusDotExample.scene) => {
    return createTestEngine(statusDotExample.ui, scenePart);
  },
});
