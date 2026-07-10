import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { mobileDatePickerExample, mobileDatePickerTestSuite } from '../src/examples';

testRunner(mobileDatePickerTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof mobileDatePickerExample.scene) => {
    return createTestEngine(mobileDatePickerExample.ui, scenePart);
  },
});
