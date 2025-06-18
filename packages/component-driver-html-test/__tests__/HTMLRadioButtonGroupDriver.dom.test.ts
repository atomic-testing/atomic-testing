import { jestTestAdapter } from '@atomic-testing/jest';
import { createTestEngine } from '@atomic-testing/react-18-19';
import { testRunner } from '@atomic-testing/test-runner';

import { uncontrolledRadioButtonGroupExample, uncontrolledRadioButtonGroupTestSuite } from '../src/examples';

testRunner(uncontrolledRadioButtonGroupTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof uncontrolledRadioButtonGroupExample.scene) => {
    return createTestEngine(uncontrolledRadioButtonGroupExample.ui, scenePart);
  },
});
