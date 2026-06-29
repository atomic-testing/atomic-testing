import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { dateTimeInputExample, dateTimeInputExampleTestSuite } from '../src/examples';

testRunner(dateTimeInputExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof dateTimeInputExample.scene) => {
    return createTestEngine(dateTimeInputExample.ui, scenePart);
  },
});
