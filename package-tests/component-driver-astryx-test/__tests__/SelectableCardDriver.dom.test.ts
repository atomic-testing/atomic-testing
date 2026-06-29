import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { selectableCardExample, selectableCardExampleTestSuite } from '../src/examples';

testRunner(selectableCardExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof selectableCardExample.scene) => {
    return createTestEngine(selectableCardExample.ui, scenePart);
  },
});
