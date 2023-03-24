import { jestTestAdapter } from '@atomic-testing/jest';
import { createTestEngine } from '@atomic-testing/react';
import { testRunner } from '@atomic-testing/test-runner';
import { complexExample, iconAndLabelExample } from '../src/examples';
import { complexButtonTestSuite } from '../src/examples/button/Complex.example';
import { iconAndLabelButtonTestSuite } from '../src/examples/button/IconAndLabel.example';

testRunner(iconAndLabelButtonTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof iconAndLabelExample.scene) => {
    return createTestEngine(iconAndLabelExample.ui, scenePart);
  },
});

testRunner(complexButtonTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof complexExample.scene) => {
    return createTestEngine(complexExample.ui, scenePart);
  },
});
