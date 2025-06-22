import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';
import { testRunner } from '@atomic-testing/internal-test-runner';

import { linkedElementExample, linkedElementTestSuite } from '../src/examples/';

testRunner(linkedElementTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof linkedElementExample.scene) => {
    return createTestEngine(linkedElementExample.ui, scenePart);
  },
});
