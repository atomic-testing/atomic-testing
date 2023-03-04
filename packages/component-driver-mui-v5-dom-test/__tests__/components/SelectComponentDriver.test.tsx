import { TestEngine } from '@testzilla/core';
import { createTestEngine } from '@testzilla/react';
import React from 'react';

import { BasicSelectExample, basicSelectExampleScenePart } from '../../src/examples/Select.examples';

describe('SelectComponentDriver', () => {
  let testEngine: TestEngine<typeof basicSelectExampleScenePart>;
  // let cleanup: () => void;
  beforeEach(() => {
    testEngine = createTestEngine(<BasicSelectExample />, basicSelectExampleScenePart);
  });

  afterEach(async () => {
    await testEngine.cleanUp();
  });

  test('happy path selection', async () => {
    const targetValue = '30';
    await testEngine.parts.select.setValue(targetValue);
    const val = await testEngine.parts.select.getValue();
    expect(val).toBe(targetValue);
  });
});
