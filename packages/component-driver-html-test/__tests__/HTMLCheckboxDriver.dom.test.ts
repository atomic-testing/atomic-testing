import { jestTestAdapter } from '@atomic-testing/jest';
import { createTestEngine } from '@atomic-testing/react-19';
import { testRunner } from '@atomic-testing/test-runner';

import {
  checkboxGroupExample,
  checkboxGroupTestSuite,
  singleCheckboxExample,
  singleCheckboxTestSuite,
} from '../src/examples';

testRunner(singleCheckboxTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof singleCheckboxExample.scene) => {
    return createTestEngine(singleCheckboxExample.ui, scenePart);
  },
});

testRunner(checkboxGroupTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof checkboxGroupExample.scene) => {
    return createTestEngine(checkboxGroupExample.ui, scenePart);
  },
});
