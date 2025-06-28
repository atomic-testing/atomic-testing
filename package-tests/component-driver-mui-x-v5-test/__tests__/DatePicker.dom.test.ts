import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-18';

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
