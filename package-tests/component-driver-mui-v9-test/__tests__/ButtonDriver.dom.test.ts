import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-18';

import {
  complexButtonTestSuite,
  complexExample,
  iconAndLabelButtonTestSuite,
  iconAndLabelExample,
} from '../src/examples';

testRunner(iconAndLabelButtonTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof iconAndLabelExample.scene) => {
    return createTestEngine(iconAndLabelExample.ui, scenePart);
  },
});

testRunner(complexButtonTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof complexExample.scene) => {
    return createTestEngine(complexExample.ui, scenePart);
  },
});
