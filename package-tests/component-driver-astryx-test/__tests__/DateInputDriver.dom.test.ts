import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { dateInputExample, dateInputExampleTestSuite } from '../src/examples';

testRunner(dateInputExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof dateInputExample.scene) => {
    return createTestEngine(dateInputExample.ui, scenePart);
  },
});
