import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-18';

import {
  basicChipExample,
  basicChipTestSuite,
  clickableChipExample,
  clickableChipTestSuite,
  deletableChipExample,
  deletableChipTestSuite,
} from '../src/examples';

testRunner(basicChipTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicChipExample.scene) => {
    return createTestEngine(basicChipExample.ui, scenePart);
  },
});

testRunner(clickableChipTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof clickableChipExample.scene) => {
    return createTestEngine(clickableChipExample.ui, scenePart);
  },
});

testRunner(deletableChipTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof deletableChipExample.scene) => {
    return createTestEngine(deletableChipExample.ui, scenePart);
  },
});
