import { TestEngine } from '@atomic-testing/core';
import { createTestEngine } from '@atomic-testing/vue-3';

import { simpleFormExample } from '../src/Form.example';

describe('SimpleForm', () => {
  let engine: TestEngine<typeof simpleFormExample.scene>;

  beforeEach(() => {
    engine = createTestEngine(simpleFormExample.ui, simpleFormExample.scene);
  });

  afterEach(async () => {
    await engine.cleanUp();
  });

  test('fill and submit form', async () => {
    await engine.parts.nameInput.setValue('John');
    await engine.parts.colorSelect.selectByLabel('Green');
    await engine.parts.gender.setValue('female');
    await engine.parts.agreeCheckbox.setSelected(true);

    await engine.parts.submitButton.click();

    const text = await engine.parts.message.getText();
    expect(text).toEqual('Name:John;Color:green;Gender:female;Agree:true');
  });
});
