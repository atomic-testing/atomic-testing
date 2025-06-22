import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-18';
import { testRunner } from '@atomic-testing/internal-test-runner';

import { basicAutoCompleteExample, basicAutoCompleteTestSuite } from '../src/examples';

testRunner(basicAutoCompleteTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicAutoCompleteExample.scene) => {
    return createTestEngine(basicAutoCompleteExample.ui, scenePart);
  },
});
