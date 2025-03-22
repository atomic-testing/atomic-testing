import { jestTestAdapter } from '@atomic-testing/jest';
import { createTestEngine } from '@atomic-testing/react-19';
import { testRunner } from '@atomic-testing/test-runner';

import {
  multipleSelectExample,
  multipleSelectTestSuite,
  singleSelectExample,
  singleSelectTestSuite,
} from '../src/examples';

testRunner(singleSelectTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof singleSelectExample.scene) => {
    return createTestEngine(singleSelectExample.ui, scenePart);
  },
});

testRunner(multipleSelectTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof multipleSelectExample.scene) => {
    return createTestEngine(multipleSelectExample.ui, scenePart);
  },
});
