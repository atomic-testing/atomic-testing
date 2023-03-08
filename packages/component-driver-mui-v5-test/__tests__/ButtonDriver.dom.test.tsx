import { TestEngine } from '@atomic-testing/core';
import { createTestEngine } from '@atomic-testing/react';
import { complexExample, iconAndLabelExample } from '../src/examples/Button.examples';

describe(`${iconAndLabelExample.title}`, () => {
  let testEngine: TestEngine<typeof iconAndLabelExample.scene>;
  beforeEach(() => {
    testEngine = createTestEngine(iconAndLabelExample.ui, iconAndLabelExample.scene);
  });

  afterEach(async () => {
    await testEngine.cleanUp();
  });

  test(`Target should be empty initially`, async () => {
    const text = await testEngine.parts.target.getText();
    expect(text).toBe('');
  });

  test(`Click on icon-button should display icon-button`, async () => {
    await testEngine.parts.iconButton.click();
    const text = await testEngine.parts.target.getText();
    expect(text).toBe('icon-button');
  });

  test(`Click on icon-label-button should display icon-label-button`, async () => {
    await testEngine.parts.iconLabelButton.click();
    const text = await testEngine.parts.target.getText();
    expect(text).toBe('icon-label-button');
  });
});

describe(`${complexExample.title}`, () => {
  let testEngine: TestEngine<typeof complexExample.scene>;
  beforeEach(() => {
    testEngine = createTestEngine(complexExample.ui, complexExample.scene);
  });

  afterEach(async () => {
    await testEngine.cleanUp();
  });

  test(`Image target should be empty initially`, async () => {
    const text = await testEngine.parts.target.getText();
    expect(text).toBe('');
  });

  test(`Click on image-button should display image-button`, async () => {
    await testEngine.parts.imageButton.click();
    const text = await testEngine.parts.target.getText();
    expect(text).toBe('image-button');
  });
});
