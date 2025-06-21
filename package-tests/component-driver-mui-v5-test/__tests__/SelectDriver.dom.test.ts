import { jestTestAdapter } from '@atomic-testing/jest';
import { createTestEngine } from '@atomic-testing/react-18';
import { testRunner } from '@atomic-testing/test-runner';

import { basicSelectExample, basicSelectTestSuite, nativeSelectExample, nativeSelectTestSuite } from '../src/examples';

testRunner(basicSelectTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicSelectExample.scene) => {
    return createTestEngine(basicSelectExample.ui, scenePart);
  },
});

testRunner(nativeSelectTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof nativeSelectExample.scene) => {
    return createTestEngine(nativeSelectExample.ui, scenePart);
  },
});
