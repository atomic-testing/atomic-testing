import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { headingExample, headingExampleTestSuite } from '../src/examples';

testRunner(headingExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof headingExample.scene) => {
    return createTestEngine(headingExample.ui, scenePart);
  },
});
