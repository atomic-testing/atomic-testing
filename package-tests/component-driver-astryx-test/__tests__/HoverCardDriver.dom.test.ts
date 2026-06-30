import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { hoverCardExample, hoverCardExampleTestSuite } from '../src/examples';

testRunner(hoverCardExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof hoverCardExample.scene) => {
    return createTestEngine(hoverCardExample.ui, scenePart);
  },
});
