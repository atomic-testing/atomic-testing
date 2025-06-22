import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import {
  controlledTextInputExample,
  controlledTextInputExampleTestSuite,
  uncontrolledTextInputExample,
  uncontrolledTextInputExampleTestSuite,
} from '../src/examples';

testRunner(uncontrolledTextInputExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof uncontrolledTextInputExample.scene) => {
    return createTestEngine(uncontrolledTextInputExample.ui, scenePart);
  },
});

testRunner(controlledTextInputExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof controlledTextInputExample.scene) => {
    return createTestEngine(controlledTextInputExample.ui, scenePart);
  },
});
