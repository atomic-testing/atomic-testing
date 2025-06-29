import { TestEngine } from '@atomic-testing/core';
import { createTestEngine } from '@atomic-testing/vue-3';

import { counterSFCExample } from '../src/Counter.sfc';

describe('Counter SFC', () => {
  let engine: TestEngine<typeof counterSFCExample.scene>;

  beforeEach(() => {
    engine = createTestEngine(counterSFCExample.ui, counterSFCExample.scene);
  });

  afterEach(async () => {
    await engine.cleanUp();
  });

  test('increments count', async () => {
    await engine.parts.button.click();
    const text = await engine.parts.button.getText();
    expect(text).toEqual('Count: 1');
  });
});
