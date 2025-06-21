import { TestEngine } from '@atomic-testing/core';
import { createTestEngine } from '@atomic-testing/vue-3';

import { counterExample } from '../src/Counter.example';

describe('Counter', () => {
  let engine: TestEngine<typeof counterExample.scene>;

  beforeEach(() => {
    engine = createTestEngine(counterExample.ui, counterExample.scene);
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
