import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

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
