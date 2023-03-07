import { expect, test } from '@playwright/test';
import { createTestEngine } from '@testzilla/playwright'

import { multipleSelectExample, singleSelectExample } from '../src/examples/HTMLSelect.examples';

test('Single Select', async ({page}) => {
  await page.goto('/select');
  const testEngine = createTestEngine(page, singleSelectExample.scene);
  const targetValue = '3';
    await testEngine.parts.select.setValue(targetValue);
    const val = await testEngine.parts.select.getValue();
    expect(val).toBe(targetValue);
    await testEngine.cleanUp();
});

test('Multiple Select', async ({page}) => {
  await page.goto('/select');
  const testEngine = createTestEngine(page, multipleSelectExample.scene);
  const targetValue = ['3', '5'];
  await testEngine.parts.select.setValue(targetValue);
  const val = await testEngine.parts.select.getValue();
  expect(val).toEqual(targetValue);
  await testEngine.cleanUp();
});

