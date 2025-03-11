import { jestTestAdapter } from '@atomic-testing/jest';
import { createTestEngine } from '@atomic-testing/react';
import { testRunner } from '@atomic-testing/test-runner';

import {
  basicTextFieldExample,
  basicTextFieldTestSuite,
  dateTextFieldExample,
  dateTextFieldTestSuite,
  multilineTextFieldExample,
  multilineTextFieldTestSuite,
  readonlyAndDisabledTextFieldExample,
  readonlyAndDisabledTextFieldTestSuite,
  selectTextFieldExample,
  selectTextFieldTestSuite,
} from '../src/examples';

testRunner(basicTextFieldTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicTextFieldExample.scene) => {
    return createTestEngine(basicTextFieldExample.ui, scenePart);
  },
});

testRunner(dateTextFieldTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof dateTextFieldExample.scene) => {
    return createTestEngine(dateTextFieldExample.ui, scenePart);
  },
});

testRunner(multilineTextFieldTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof multilineTextFieldExample.scene) => {
    return createTestEngine(multilineTextFieldExample.ui, scenePart);
  },
});

testRunner(selectTextFieldTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof selectTextFieldExample.scene) => {
    return createTestEngine(selectTextFieldExample.ui, scenePart);
  },
});

testRunner(readonlyAndDisabledTextFieldTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof readonlyAndDisabledTextFieldExample.scene) => {
    return createTestEngine(readonlyAndDisabledTextFieldExample.ui, scenePart);
  },
});
