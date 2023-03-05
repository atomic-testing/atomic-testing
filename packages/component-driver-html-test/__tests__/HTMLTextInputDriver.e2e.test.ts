import { expect, test } from '@playwright/test';
import { createTestEngine } from '@testzilla/playwright'
import { basicTextInputExampleScenePart } from '../src/examples';

test('HTMLTextInput', async ({ page }) => {
  await page.goto('/input');
  const testEngine = createTestEngine(page, basicTextInputExampleScenePart);
  const targetValue = 'abc';
  await testEngine.parts.input.setValue(targetValue);
    const val = await testEngine.parts.input.getValue();
    expect(val).toBe(targetValue);
});
