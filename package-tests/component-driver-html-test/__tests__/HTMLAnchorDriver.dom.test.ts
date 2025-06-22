import { jestTestAdapter } from '@atomic-testing/jest';
import { createTestEngine } from '@atomic-testing/react-19';
import { testRunner } from '@atomic-testing/test-runner';

import { hoverAnchorExample, hoverAnchorExampleTestSuite } from '../src/examples';

testRunner(hoverAnchorExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof hoverAnchorExample.scene) => {
    return createTestEngine(hoverAnchorExample.ui, scenePart);
  },
});
