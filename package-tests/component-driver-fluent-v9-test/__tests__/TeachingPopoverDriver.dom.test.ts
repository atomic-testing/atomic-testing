import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { teachingPopoverExample, teachingPopoverExampleTestSuite } from '../src/examples';

testRunner(teachingPopoverExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof teachingPopoverExample.scene) => {
    return createTestEngine(teachingPopoverExample.ui, scenePart);
  },
});
