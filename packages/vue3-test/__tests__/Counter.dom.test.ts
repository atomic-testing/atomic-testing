import { jestTestAdapter } from '@atomic-testing/jest';
import { createTestEngine } from '@atomic-testing/vue-3';
import { testRunner } from '@atomic-testing/test-runner';

import { counterExample } from '../src';

// Define test suite
const counterExampleTestSuite = {
  title: 'Counter Example',
  url: '/',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe('Counter', () => {
      let engine: ReturnType<typeof getTestEngine>;

      beforeEach(() => {
        engine = getTestEngine(counterExample.scene);
      });

      afterEach(async () => {
        await engine.cleanUp();
      });

      test('increments count', async () => {
        await engine.parts.button.click();
        const text = await engine.parts.button.getText();
        assertEqual(text, 'Count: 1');
      });
    });
  },
};

testRunner(counterExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof counterExample.scene) => {
    return createTestEngine(counterExample.ui, scenePart);
  },
});
