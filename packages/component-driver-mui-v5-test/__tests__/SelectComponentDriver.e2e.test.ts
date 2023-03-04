import { expect, test } from '@playwright/test';
import { createTestEngine } from '@testzilla/playwright'
import { basicSelectExampleScenePart } from '../src/examples';

test('happy path selection', async ({ page }) => {
  await page.goto('http://localhost:3000/select');
  const testEngine = createTestEngine(page, basicSelectExampleScenePart);
  const targetValue = '30';
  await testEngine.parts.select.setValue(targetValue);
  const val = await testEngine.parts.select.getValue();
  expect(val).toBe(targetValue);
});
