import { jestTestAdapter } from '@atomic-testing/jest';
import { createTestEngine } from '@atomic-testing/react';
import { testRunner } from '@atomic-testing/test-runner';

import {
  exclusiveSelectionTestSuite,
  regularSelectionButtonTestSuite,
  regularSelectionExample,
  singleToggleButtonTestSuite,
  singleToggleExample,
} from '../src/examples';
import { exclusiveSelectionExample } from '../src/examples/toggleButton/ExclusiveSelection.example';

testRunner(singleToggleButtonTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof singleToggleExample.scene) => {
    return createTestEngine(singleToggleExample.ui, scenePart);
  },
});

testRunner(exclusiveSelectionTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof exclusiveSelectionExample.scene) => {
    return createTestEngine(exclusiveSelectionExample.ui, scenePart);
  },
});

testRunner(regularSelectionButtonTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof regularSelectionExample.scene) => {
    return createTestEngine(regularSelectionExample.ui, scenePart);
  },
});
