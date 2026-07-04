import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { timePickerExample, timePickerTestSuite } from '../src/examples';

testRunner(timePickerTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof timePickerExample.scene) => {
    return createTestEngine(timePickerExample.ui, scenePart);
  },
});
