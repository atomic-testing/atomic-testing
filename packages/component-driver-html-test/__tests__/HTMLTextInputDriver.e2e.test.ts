import { expect, test } from '@playwright/test';
import { createTestEngine } from '@testzilla/playwright'
import { uncontrolledTextInputExampleScenePart } from '../src/examples';

test('HTMLTextInputDriver', async ({ page }) => {
  await page.goto('/input');
  const testEngine = createTestEngine(page, uncontrolledTextInputExampleScenePart);
  const targetValue = 'abc';
  await testEngine.parts.input.setValue(targetValue);
    const val = await testEngine.parts.input.getValue();
    expect(val).toBe(targetValue);
});
