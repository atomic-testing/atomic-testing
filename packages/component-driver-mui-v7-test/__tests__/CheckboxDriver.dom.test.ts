import { jestTestAdapter } from '@atomic-testing/jest';
import { createTestEngine } from '@atomic-testing/react';
import { testRunner } from '@atomic-testing/test-runner';

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
