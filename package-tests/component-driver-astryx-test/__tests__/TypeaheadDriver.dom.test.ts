import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { typeaheadExample, typeaheadExampleTestSuite } from '../src/examples';

testRunner(typeaheadExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof typeaheadExample.scene) => {
    return createTestEngine(typeaheadExample.ui, scenePart);
  },
});
