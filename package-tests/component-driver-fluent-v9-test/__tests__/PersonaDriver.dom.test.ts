import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { personaExample, personaExampleTestSuite } from '../src/examples';

testRunner(personaExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof personaExample.scene) => {
    return createTestEngine(personaExample.ui, scenePart);
  },
});
