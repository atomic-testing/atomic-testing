import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { dateTimePickerExample, dateTimePickerTestSuite } from '../src/examples';

testRunner(dateTimePickerTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof dateTimePickerExample.scene) => {
    return createTestEngine(dateTimePickerExample.ui, scenePart);
  },
});
