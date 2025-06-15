import { createTestEngine } from '@atomic-testing/playwright';
import { expect, test } from '@playwright/test';

import { getGoodCredentialMock } from './__mocks__/signup';
import { parts } from './signupScenePart';

// Shortened end-to-end test using Playwright

test('user can sign up', async ({ page }) => {
  await page.goto('/');
  const engine = createTestEngine(page, parts);

  await engine.parts.credentialStep.setValue(getGoodCredentialMock());
  await engine.parts.credentialStep.next();
  await expect(await engine.parts.shippingStep.isVisible()).toBe(true);
});
