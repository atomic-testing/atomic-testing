import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import {
  clickLocationMouseEventExample,
  clickLocationMouseEventExampleTestSuite,
  hoverMouseEventExample,
  hoverMouseEventExampleTestSuite,
  mouseLocationMouseEventExample,
  mouseLocationMouseEventExampleTestSuite,
  mouseOverMouseEventExample,
  mouseOverMouseEventExampleTestSuite,
} from '../src/examples';

testRunner(hoverMouseEventExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof hoverMouseEventExample.scene) => {
    return createTestEngine(hoverMouseEventExample.ui, scenePart);
  },
});

testRunner(clickLocationMouseEventExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof clickLocationMouseEventExample.scene) => {
    return createTestEngine(clickLocationMouseEventExample.ui, scenePart);
  },
});

testRunner(mouseLocationMouseEventExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof mouseLocationMouseEventExample.scene) => {
    return createTestEngine(mouseLocationMouseEventExample.ui, scenePart);
  },
});

testRunner(mouseOverMouseEventExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof mouseOverMouseEventExample.scene) => {
    return createTestEngine(mouseOverMouseEventExample.ui, scenePart);
  },
});
