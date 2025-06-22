import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { hoverAnchorExample, hoverAnchorExampleTestSuite } from '../src/examples';

testRunner(hoverAnchorExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof hoverAnchorExample.scene) => {
    return createTestEngine(hoverAnchorExample.ui, scenePart);
  },
});
