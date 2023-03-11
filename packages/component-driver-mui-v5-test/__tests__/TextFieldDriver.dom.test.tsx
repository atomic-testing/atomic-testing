import { TestEngine } from '@atomic-testing/core';
import { createTestEngine } from '@atomic-testing/react';

import {
  basicTextFieldExample,
  multilineTextFieldExample,
  selectTextFieldExample,
} from '../src/examples/TextField.examples';

describe(`${basicTextFieldExample.title}`, () => {
  let testEngine: TestEngine<typeof basicTextFieldExample.scene>;
  beforeEach(() => {
    testEngine = createTestEngine(basicTextFieldExample.ui, basicTextFieldExample.scene);
  });

  afterEach(async () => {
    await testEngine.cleanUp();
  });

  test(`Label should be Basic Field`, async () => {
    const label = await testEngine.parts.basic.getLabel();
    expect(label).toBe('Basic Field');
  });

  test(`Helper text should be Enter text here`, async () => {
    const helperText = await testEngine.parts.basic.getHelperText();
    expect(helperText).toBe('Enter text here');
  });

  test(`Value should be empty`, async () => {
    const value = await testEngine.parts.basic.getValue();
    expect(value).toBe('');
  });

  test(`Alter value should change the value`, async () => {
    await testEngine.parts.basic.setValue('Hello World');
    const value = await testEngine.parts.basic.getValue();
    expect(value).toBe('Hello World');
  });
});

describe(`${multilineTextFieldExample.title}`, () => {
  let testEngine: TestEngine<typeof multilineTextFieldExample.scene>;
  beforeEach(() => {
    testEngine = createTestEngine(multilineTextFieldExample.ui, multilineTextFieldExample.scene);
  });

  afterEach(async () => {
    await testEngine.cleanUp();
  });

  test(`Label should be Multiline`, async () => {
    const label = await testEngine.parts.multiline.getLabel();
    expect(label).toBe('Multiline');
  });

  test(`Helper text should be undefined`, async () => {
    const helperText = await testEngine.parts.multiline.getHelperText();
    expect(helperText).toBeUndefined();
  });

  test(`Value should be "Default Value" as assigned`, async () => {
    const value = await testEngine.parts.multiline.getValue();
    expect(value).toBe('Default Value');
  });

  test(`Alter value should change the value`, async () => {
    await testEngine.parts.multiline.setValue('Hello World');
    const value = await testEngine.parts.multiline.getValue();
    expect(value).toBe('Hello World');
  });
});

describe(`${selectTextFieldExample.title}`, () => {
  let testEngine: TestEngine<typeof selectTextFieldExample.scene>;
  beforeEach(() => {
    testEngine = createTestEngine(selectTextFieldExample.ui, selectTextFieldExample.scene);
  });

  afterEach(async () => {
    await testEngine.cleanUp();
  });

  test(`Label should be Number`, async () => {
    const label = await testEngine.parts.select.getLabel();
    expect(label).toBe('Number');
  });

  test(`Value should be "30" as assigned`, async () => {
    const value = await testEngine.parts.select.getValue();
    expect(value).toBe('30');
  });

  test(`Alter value should change the value`, async () => {
    await testEngine.parts.select.setValue('60');
    const value = await testEngine.parts.select.getValue();
    expect(value).toBe('60');
  });
});
