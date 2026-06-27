import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-18';

import { basicStepperExample, basicStepperTestSuite } from '../src/examples';

testRunner(basicStepperTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicStepperExample.scene) => {
    return createTestEngine(basicStepperExample.ui, scenePart);
  },
});
