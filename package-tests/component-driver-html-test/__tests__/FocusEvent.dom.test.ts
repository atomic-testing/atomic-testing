import { jestTestAdapter } from '@atomic-testing/jest';
import { createTestEngine } from '@atomic-testing/react-19';
import { testRunner } from '@atomic-testing/test-runner';

import { focusEventExample, focusEventExampleTestSuite } from '../src/examples';

testRunner(focusEventExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof focusEventExample.scene) => {
    return createTestEngine(focusEventExample.ui, scenePart);
  },
});
