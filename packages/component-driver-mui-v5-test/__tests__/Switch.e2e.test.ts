import { TestEngine } from '@atomic-testing/core';
import { createTestEngine } from '@atomic-testing/playwright';
import { expect, test } from '@playwright/test';
import { basicSwitchExample } from '../src/examples/Switch.examples';

test.describe(`${basicSwitchExample.title}`, () => {
  let testEngine: TestEngine<typeof basicSwitchExample.scene>;
  test.beforeEach(async ({ page }) => {
    await page.goto('/switch');
    testEngine = createTestEngine(page, basicSwitchExample.scene);
  });

  test.afterEach(async () => {
    await testEngine.cleanUp();
  });

  test(`Checked switch is selected initially`, async () => {
    const value = await testEngine.parts.checked.isSelected();
    expect(value).toBe(true);
  });

  test(`Checked switch is not disabled`, async () => {
    const value = await testEngine.parts.unchecked.isDisabled();
    expect(value).toBe(false);
  });

  test(`Unchecked switch is not selected initially`, async () => {
    const value = await testEngine.parts.unchecked.isSelected();
    expect(value).toBe(false);
  });

  test(`Disabled switch is not selected`, async () => {
    const value = await testEngine.parts.disabled.isSelected();
    expect(value).toBe(false);
  });

  test(`Disabled switch is disabled`, async () => {
    const value = await testEngine.parts.disabled.isDisabled();
    expect(value).toBe(true);
  });

  test(`Set checked switch to not selected should work`, async () => {
    await testEngine.parts.checked.setSelected(false);
    const value = await testEngine.parts.checked.isSelected();
    expect(value).toBe(false);
  });

  test(`Set unchecked switch to selected should work`, async () => {
    await testEngine.parts.unchecked.setSelected(true);
    const value = await testEngine.parts.unchecked.isSelected();
    expect(value).toBe(true);
  });
});
