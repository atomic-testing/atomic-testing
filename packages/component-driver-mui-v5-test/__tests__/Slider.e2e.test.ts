import { TestEngine } from '@atomic-testing/core';
import { createTestEngine } from '@atomic-testing/playwright';
import { expect, test } from '@playwright/test';
import { basicSliderExample } from '../src/examples/Slider.examples';

/**
 * Support for HTML input range component is limited in Playwright.
 */
test.describe.skip(`${basicSliderExample.title}`, () => {
  let testEngine: TestEngine<typeof basicSliderExample.scene>;
  test.beforeEach(async ({ page }) => {
    await page.goto('/slider');
    testEngine = createTestEngine(page, basicSliderExample.scene);
  });

  test.afterEach(async () => {
    await testEngine.cleanUp();
  });

  test(`Basic slider's Value should be 75`, async () => {
    const value = await testEngine.parts.basic.getValue();
    expect(value).toBe(75);
  });

  test(`Disabled slider's value should be 75`, async () => {
    const value = await testEngine.parts.disabled.getValue();
    expect(value).toBe(75);
  });

  test(`Range slider's value should be [30, 65]`, async () => {
    const value = await testEngine.parts.range.getRangeValues();
    expect(value).toEqual([30, 65]);
  });

  test.skip(`Setting basic slider's value should change its state`, async () => {
    // TODO: https://github.com/tangentlin/atomic-testing/issues/73
    await testEngine.parts.basic.setValue(50);
    const value = await testEngine.parts.basic.getValue();
    expect(value).toBe(50);
  });
});
