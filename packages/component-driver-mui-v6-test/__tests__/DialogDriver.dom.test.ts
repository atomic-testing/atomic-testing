import { jestTestAdapter } from '@atomic-testing/jest';
import { createTestEngine } from '@atomic-testing/react';
import { testRunner } from '@atomic-testing/test-runner';
import {
  alertDialogExample,
  alertDialogTestSuite,
  slideinDialogExample,
  slideinDialogTestSuite,
} from '../src/examples';

testRunner(alertDialogTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof alertDialogExample.scene) => {
    return createTestEngine(alertDialogExample.ui, scenePart);
  },
});

testRunner(slideinDialogTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof slideinDialogExample.scene) => {
    return createTestEngine(slideinDialogExample.ui, scenePart);
  },
});
