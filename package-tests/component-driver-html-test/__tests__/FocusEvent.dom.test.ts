import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { focusEventExample, focusEventExampleTestSuite } from '../src/examples';

testRunner(focusEventExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof focusEventExample.scene) => {
    return createTestEngine(focusEventExample.ui, scenePart);
  },
});
