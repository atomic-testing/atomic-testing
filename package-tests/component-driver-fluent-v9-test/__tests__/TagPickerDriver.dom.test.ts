import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { tagPickerExample, tagPickerExampleTestSuite } from '../src/examples';

testRunner(tagPickerExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof tagPickerExample.scene) => {
    return createTestEngine(tagPickerExample.ui, scenePart);
  },
});
