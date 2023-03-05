import { createTestEngine } from '@testzilla/react';
import React from 'react';

import { BasicTextInputExample, basicTextInputExampleScenePart } from '../src/examples/HTMLTextInput.examples';

describe('HTMLTextInput', () => {
  test('basic input', async () => {
    const testEngine = createTestEngine(<BasicTextInputExample />, basicTextInputExampleScenePart);
    const targetValue = 'abc';
    await testEngine.parts.input.setValue(targetValue);
    const val = await testEngine.parts.input.getValue();
    expect(val).toBe(targetValue);
  });
});
