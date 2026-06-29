import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { commandPaletteExample, commandPaletteExampleTestSuite } from '../src/examples';

testRunner(commandPaletteExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof commandPaletteExample.scene) => {
    return createTestEngine(commandPaletteExample.ui, scenePart);
  },
});
