import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-18';
import { testRunner } from '@atomic-testing/internal-test-runner';

import { selectableListExample, selectableListTestSuite } from '../src/examples';

testRunner(selectableListTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof selectableListExample.scene) => {
    return createTestEngine(selectableListExample.ui, scenePart);
  },
});
