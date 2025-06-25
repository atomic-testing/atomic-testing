import { TestEngine } from '@atomic-testing/core';
import { createTestEngine } from '@atomic-testing/angular-20';

import { formExample } from '../src/Form.example';

describe('FormComponent', () => {
  let engine: TestEngine<typeof formExample.scene>;

  beforeEach(() => {
    engine = createTestEngine(formExample.ui, formExample.scene);
  });

  afterEach(async () => {
    await engine.cleanUp();
  });

  test('updates values', async () => {
    await engine.parts.textInput.enterText('hello');
    await engine.parts.checkbox.click();
    await engine.parts.select.setValue('two');
    const text = await engine.parts.result.getText();
    expect(text).toEqual('hello - true - two');
  });
});
