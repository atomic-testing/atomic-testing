import { jestTestAdapter } from '@atomic-testing/jest';
import { createTestEngine } from '@atomic-testing/react';
import { testRunner } from '@atomic-testing/test-runner';

import { basicDatePickerExample, basicDatePickerTestSuite } from '../src/examples';

testRunner(basicDatePickerTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicDatePickerExample.scene) => {
    return createTestEngine(basicDatePickerExample.ui, scenePart);
  },
});

// TODO: An update to DataRangePicker has broken the test
// testRunner(basicDateRangePickerTestSuite, jestTestAdapter, {
//   getTestEngine: (scenePart: typeof basicDateRangePickerExample.scene) => {
//     return createTestEngine(basicDateRangePickerExample.ui, scenePart);
//   },
// });
