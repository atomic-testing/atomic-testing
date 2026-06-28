import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-18';

import { basicRadioGroupExample, basicRadioGroupTestSuite } from '../src/examples';

testRunner(basicRadioGroupTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicRadioGroupExample.scene) => {
    return createTestEngine(basicRadioGroupExample.ui, scenePart);
  },
});
