import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-18';
import { testRunner } from '@atomic-testing/internal-test-runner';

import {
  iconCheckboxExample,
  iconCheckboxTestSuite,
  indeterminateCheckboxExample,
  indeterminateCheckboxTestSuite,
  labelCheckboxExample,
  labelCheckboxTestSuite,
} from '../src/examples';

testRunner(labelCheckboxTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof labelCheckboxExample.scene) => {
    return createTestEngine(labelCheckboxExample.ui, scenePart);
  },
});

testRunner(iconCheckboxTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof iconCheckboxExample.scene) => {
    return createTestEngine(iconCheckboxExample.ui, scenePart);
  },
});

testRunner(indeterminateCheckboxTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof indeterminateCheckboxExample.scene) => {
    return createTestEngine(indeterminateCheckboxExample.ui, scenePart);
  },
});
