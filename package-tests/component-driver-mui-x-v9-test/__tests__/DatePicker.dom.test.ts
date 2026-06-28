import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { desktopDatePickerExample, desktopDatePickerTestSuite } from '../src/examples';

testRunner(desktopDatePickerTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof desktopDatePickerExample.scene) => {
    return createTestEngine(desktopDatePickerExample.ui, scenePart);
  },
});
