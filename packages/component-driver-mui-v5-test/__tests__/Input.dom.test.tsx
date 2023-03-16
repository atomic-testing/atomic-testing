import { TestEngine } from '@atomic-testing/core';
import { createTestEngine } from '@atomic-testing/react';

import { basicInputExample } from '../src/examples/Input.examples';

describe(`${basicInputExample.title}`, () => {
  let testEngine: TestEngine<typeof basicInputExample.scene>;
  beforeEach(() => {
    testEngine = createTestEngine(basicInputExample.ui, basicInputExample.scene);
  });

  afterEach(async () => {
    await testEngine.cleanUp();
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

  test(`Readonly part is readonly`, async () => {
    const value = await testEngine.parts.readonly.isReadonly();
    expect(value).toBe(true);
  });

  test(`Disabled part is disabled`, async () => {
    const value = await testEngine.parts.disabled.isDisabled();
    expect(value).toBe(true);
  });
});
