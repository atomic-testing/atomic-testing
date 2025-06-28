import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { uncontrolledRadioButtonGroupExample, uncontrolledRadioButtonGroupTestSuite } from '../src/examples';

testRunner(uncontrolledRadioButtonGroupTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof uncontrolledRadioButtonGroupExample.scene) => {
    return createTestEngine(uncontrolledRadioButtonGroupExample.ui, scenePart);
  },
});
