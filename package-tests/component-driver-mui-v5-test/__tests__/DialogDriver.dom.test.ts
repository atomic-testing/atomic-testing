import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-18';

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
