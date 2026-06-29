import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { numberInputExample, numberInputExampleTestSuite } from '../src/examples';

testRunner(numberInputExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof numberInputExample.scene) => {
    return createTestEngine(numberInputExample.ui, scenePart);
  },
});
