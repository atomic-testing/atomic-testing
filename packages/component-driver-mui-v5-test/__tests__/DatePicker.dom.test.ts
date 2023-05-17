import { jestTestAdapter } from '@atomic-testing/jest';
import { createTestEngine } from '@atomic-testing/react';
import { testRunner } from '@atomic-testing/test-runner';
import { basicDatePickerExample, basicDatePickerTestSuite } from '../src/examples';

testRunner(basicDatePickerTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicDatePickerExample.scene) => {
    return createTestEngine(basicDatePickerExample.ui, scenePart);
  },
});
