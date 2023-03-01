import { expect, test } from '@playwright/test';
import { SelectComponentDriver } from '@testzilla/component-driver-mui-v5';
import { byDataTestId, ScenePart } from '@testzilla/core';

import { createTestEngine } from '../src/createTestEngine';

const testScenePart = {
  select: {
    locator: byDataTestId('demo-simple-select'),
    driver: SelectComponentDriver,
  },
} satisfies ScenePart;

test('happy path selection', async ({ page }) => {
  await page.goto('http://localhost:6006/iframe.html?args=&id=mui-v5-select--secondary-button&viewMode=story');
  const testEngine = createTestEngine(page, testScenePart);
  const targetValue = '30';
  await testEngine.parts.select.setValue(targetValue);
  const val = await testEngine.parts.select.getValue();
  expect(val).toBe(targetValue);
});
