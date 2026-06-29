import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { rangeInputExample, rangeInputExampleTestSuite } from '../src/examples';

testRunner(rangeInputExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof rangeInputExample.scene) => {
    return createTestEngine(rangeInputExample.ui, scenePart);
  },
});
