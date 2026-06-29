import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { calendarExample, calendarExampleTestSuite } from '../src/examples';

testRunner(calendarExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof calendarExample.scene) => {
    return createTestEngine(calendarExample.ui, scenePart);
  },
});
