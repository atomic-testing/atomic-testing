import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { dateRangePickerExample, dateRangePickerTestSuite } from '../src/examples';

testRunner(dateRangePickerTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof dateRangePickerExample.scene) => {
    return createTestEngine(dateRangePickerExample.ui, scenePart);
  },
});
