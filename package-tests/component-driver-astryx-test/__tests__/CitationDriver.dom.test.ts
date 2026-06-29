import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { citationExample, citationExampleTestSuite } from '../src/examples';

testRunner(citationExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof citationExample.scene) => {
    return createTestEngine(citationExample.ui, scenePart);
  },
});
