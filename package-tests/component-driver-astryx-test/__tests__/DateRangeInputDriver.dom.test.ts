import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { dateRangeInputExample, dateRangeInputExampleTestSuite } from '../src/examples';

testRunner(dateRangeInputExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof dateRangeInputExample.scene) => {
    return createTestEngine(dateRangeInputExample.ui, scenePart);
  },
});
