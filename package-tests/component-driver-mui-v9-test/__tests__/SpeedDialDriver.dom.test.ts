import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-18';

import { basicSpeedDialExample, basicSpeedDialTestSuite } from '../src/examples';

testRunner(basicSpeedDialTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicSpeedDialExample.scene) => {
    return createTestEngine(basicSpeedDialExample.ui, scenePart);
  },
});
