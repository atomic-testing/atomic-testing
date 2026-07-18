import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { swatchPickerExample, swatchPickerExampleTestSuite } from '../src/examples';

testRunner(swatchPickerExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof swatchPickerExample.scene) => {
    return createTestEngine(swatchPickerExample.ui, scenePart);
  },
});
