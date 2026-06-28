import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-18';

import {
  basicTextFieldExample,
  basicTextFieldTestSuite,
  dateTextFieldExample,
  dateTextFieldTestSuite,
  multilineTextFieldExample,
  multilineTextFieldTestSuite,
  numberTextFieldExample,
  numberTextFieldTestSuite,
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

testRunner(numberTextFieldTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof numberTextFieldExample.scene) => {
    return createTestEngine(numberTextFieldExample.ui, scenePart);
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
