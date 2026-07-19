import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { searchBoxExample, searchBoxExampleTestSuite } from '../src/examples';

testRunner(searchBoxExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof searchBoxExample.scene) => {
    return createTestEngine(searchBoxExample.ui, scenePart);
  },
});
