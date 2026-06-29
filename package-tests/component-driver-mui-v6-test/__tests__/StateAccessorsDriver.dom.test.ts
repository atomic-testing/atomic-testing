import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-18';

import { stateAccessorsExample, stateAccessorsTestSuite } from '../src/examples';

testRunner(stateAccessorsTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof stateAccessorsExample.scene) => {
    return createTestEngine(stateAccessorsExample.ui, scenePart);
  },
});
