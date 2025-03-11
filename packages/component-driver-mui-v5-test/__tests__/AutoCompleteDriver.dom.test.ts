import { jestTestAdapter } from '@atomic-testing/jest';
import { createTestEngine } from '@atomic-testing/react';
import { testRunner } from '@atomic-testing/test-runner';

import { basicAutoCompleteExample, basicAutoCompleteTestSuite } from '../src/examples';

testRunner(basicAutoCompleteTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicAutoCompleteExample.scene) => {
    return createTestEngine(basicAutoCompleteExample.ui, scenePart);
  },
});
