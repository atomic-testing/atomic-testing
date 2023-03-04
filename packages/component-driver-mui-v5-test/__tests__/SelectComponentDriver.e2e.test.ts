import { expect, test } from '@playwright/test';
import { SelectComponentDriver } from '@testzilla/component-driver-mui-v5';
import { createTestEngine } from '@testzilla/playwright'
import { byDataTestId, ScenePart } from '@testzilla/core';
import { basicSelectExampleScenePart } from '../src/examples';

const testScenePart = {
  select: {
    locator: byDataTestId('demo-simple-select'),
    driver: SelectComponentDriver,
  },
} satisfies ScenePart;

test('happy path selection', async ({ page }) => {
  await page.goto('http://testzilla-mui-v5.s3-website-us-east-1.amazonaws.com/select');
  const testEngine = createTestEngine(page, basicSelectExampleScenePart);
  const targetValue = '30';
  await testEngine.parts.select.setValue(targetValue);
  const val = await testEngine.parts.select.getValue();
  expect(val).toBe(targetValue);
});
