import { expect, test } from '@playwright/test';
import { createTestEngine } from '@testzilla/playwright'
import { basicTextInputExampleScenePart } from '../src/examples';

test('HTMLTextInput', async ({ page }) => {
  await page.goto('/select');
  const testEngine = createTestEngine(page, basicTextInputExampleScenePart);
  const targetValue = 'abc';
  await testEngine.parts.select.setValue(targetValue);
  const val = await testEngine.parts.select.getValue();
  expect(val).toBe(targetValue);
});
