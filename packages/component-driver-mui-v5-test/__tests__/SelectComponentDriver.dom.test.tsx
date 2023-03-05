import { createTestEngine } from '@testzilla/react';
import React from 'react';

import { BasicSelectExample, basicSelectExampleScenePart } from '../src/examples/Select.examples';

describe('SelectComponentDriver', () => {
  test('basic select', async () => {
    const testEngine = createTestEngine(<BasicSelectExample />, basicSelectExampleScenePart);
    const targetValue = '30';
    await testEngine.parts.select.setValue(targetValue);
    const val = await testEngine.parts.select.getValue();
    expect(val).toBe(targetValue);
    await testEngine.cleanUp();
  });
});
