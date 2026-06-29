import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { dividerExample, dividerExampleTestSuite } from '../src/examples';

testRunner(dividerExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof dividerExample.scene) => {
    return createTestEngine(dividerExample.ui, scenePart);
  },
});
