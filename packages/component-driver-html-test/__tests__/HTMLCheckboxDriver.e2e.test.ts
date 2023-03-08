import { TestEngine } from '@atomic-testing/core';
import { createTestEngine } from '@atomic-testing/playwright';
import { expect, test } from '@playwright/test';

import { checkboxGroupExample, singleCheckboxExample } from '../src/examples';

test.describe('HTMLCheckboxDriver', () => {
  let testEngine: TestEngine<typeof singleCheckboxExample.scene>;
  test.beforeEach(async ({ page }) => {
    await page.goto('/checkbox');
    testEngine = createTestEngine(page, singleCheckboxExample.scene);
  });

  test.afterEach(async () => {
    await testEngine.cleanUp();
  });

  test.describe('Initial state', () => {
    test('isSelected() should be false', async () => {
      const val = await testEngine.parts.toggle.isSelected();
      expect(val).toBe(false);
    });
    test('value should be null because it is not checked', async () => {
      const val = await testEngine.parts.toggle.getValue();
      expect(val).toBeNull();
    });
  });

  test.describe('Upon setting selected to true', () => {
    test.beforeEach(async () => {
      await testEngine.parts.toggle.setSelected(true);
    });

    test('isSelected() should be true', async () => {
      const val = await testEngine.parts.toggle.isSelected();
      expect(val).toBe(true);
    });
    test('value should be the checkbox value attribute', async () => {
      const val = await testEngine.parts.toggle.getValue();
      expect(val).toEqual('1');
    });
  });
});

test.describe('HTMLCheckboxGroupDriver', () => {
  let testEngine: TestEngine<typeof checkboxGroupExample.scene>;
  test.beforeEach(async ({ page }) => {
    await page.goto('/checkbox');
    testEngine = createTestEngine(page, checkboxGroupExample.scene);
  });

  test.afterEach(async () => {
    await testEngine.cleanUp();
  });

  test.describe('Initial state', () => {
    test('value should be empty array', async () => {
      const val = await testEngine.parts.toggles.getValue();
      expect(val).toHaveLength(0);
    });
  });

  test.describe('Upon setting selected to true', () => {
    test.beforeEach(async () => {
      await testEngine.parts.toggles.setValue(['2', '5']);
    });

    test('value should be the same as what were set', async () => {
      const val = await testEngine.parts.toggles.getValue();
      expect(val).toEqual(['2', '5']);
    });
  });
});
