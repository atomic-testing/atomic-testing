import { TestEngine } from '@atomic-testing/core';
import { createTestEngine } from '@atomic-testing/react';
import { checkboxGroupExample, singleCheckboxExample } from '../src/examples';

describe('HTMLCheckboxDriver', () => {
  let testEngine: TestEngine<typeof singleCheckboxExample.scene>;
  beforeEach(() => {
    testEngine = createTestEngine(singleCheckboxExample.ui, singleCheckboxExample.scene);
  });

  afterEach(async () => {
    await testEngine.cleanUp();
  });

  describe('Initial state', () => {
    test('isSelected() should be false', async () => {
      const val = await testEngine.parts.toggle.isSelected();
      expect(val).toBe(false);
    });
    test('value should be null because it is not checked', async () => {
      const val = await testEngine.parts.toggle.getValue();
      expect(val).toBeNull();
    });
  });

  describe('Upon setting selected to true', () => {
    beforeEach(async () => {
      await testEngine.parts.toggle.setSelected(true);
    });

    test('isSelected() should be true', async () => {
      const val = await testEngine.parts.toggle.isSelected();
      expect(val).toBe(true);
    });
    test("value should be the checkbox's value", async () => {
      const val = await testEngine.parts.toggle.getValue();
      expect(val).toEqual('1');
    });
  });
});

describe('HTMLCheckboxGroupDriver', () => {
  let testEngine: TestEngine<typeof checkboxGroupExample.scene>;
  beforeEach(() => {
    testEngine = createTestEngine(checkboxGroupExample.ui, checkboxGroupExample.scene);
  });

  afterEach(async () => {
    await testEngine.cleanUp();
  });

  describe('Initial state', () => {
    test('value should be empty array', async () => {
      const val = await testEngine.parts.toggles.getValue();
      expect(val).toHaveLength(0);
    });
  });

  describe('Upon setting selected to true', () => {
    beforeEach(async () => {
      await testEngine.parts.toggles.setValue(['2', '5']);
    });

    test('value should be the same as what were set', async () => {
      const val = await testEngine.parts.toggles.getValue();
      expect(val).toEqual(['2', '5']);
    });
  });
});
