import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { dropdownMenuExample, dropdownMenuExampleTestSuite } from '../src/examples';

testRunner(dropdownMenuExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof dropdownMenuExample.scene) => {
    return createTestEngine(dropdownMenuExample.ui, scenePart);
  },
});
