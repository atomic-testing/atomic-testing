import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { dropdownExample, dropdownExampleTestSuite } from '../src/examples';

testRunner(dropdownExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof dropdownExample.scene) => {
    return createTestEngine(dropdownExample.ui, scenePart);
  },
});
