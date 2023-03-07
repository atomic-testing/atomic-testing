import { expect, test } from '@playwright/test';
import { createTestEngine } from '@testzilla/playwright'

import { uncontrolRadioButtonGroupExampleScenePart } from '../src/examples/HTMLRadioButtonGroup.examples';

test("HTMLRadioButtonGroup", async ({ page }) => {
  await page.goto('/radio-buttons');
  const testEngine = createTestEngine(page, uncontrolRadioButtonGroupExampleScenePart);
  const targetValue = '3';
  await testEngine.parts.input.setValue(targetValue);
  const val = await testEngine.parts.input.getValue();
  expect(val).toBe(targetValue);
  await testEngine.cleanUp();
});
