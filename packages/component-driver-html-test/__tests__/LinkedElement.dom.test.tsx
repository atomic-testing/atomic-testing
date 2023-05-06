import { jestTestAdapter } from '@atomic-testing/jest';
import { createTestEngine } from '@atomic-testing/react';
import { testRunner } from '@atomic-testing/test-runner';
import { linkedElementExample, linkedElementTestSuite } from '../src/examples/form/LinkedElement.examples';

testRunner(linkedElementTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof linkedElementExample.scene) => {
    return createTestEngine(linkedElementExample.ui, scenePart);
  },
});
