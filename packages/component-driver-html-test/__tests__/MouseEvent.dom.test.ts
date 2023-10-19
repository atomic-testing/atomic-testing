import { jestTestAdapter } from '@atomic-testing/jest';
import { createTestEngine } from '@atomic-testing/react';
import { testRunner } from '@atomic-testing/test-runner';
import { hoverMouseEventExample, hoverMouseEventExampleTestSuite } from '../src/examples';

testRunner(hoverMouseEventExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof hoverMouseEventExample.scene) => {
    return createTestEngine(hoverMouseEventExample.ui, scenePart);
  },
});
