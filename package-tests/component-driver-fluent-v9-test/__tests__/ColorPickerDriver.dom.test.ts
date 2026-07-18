import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { colorPickerExample, colorPickerExampleTestSuite } from '../src/examples';

testRunner(colorPickerExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof colorPickerExample.scene) => {
    return createTestEngine(colorPickerExample.ui, scenePart);
  },
});
