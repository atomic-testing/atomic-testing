import { createTestEngine } from '@atomic-testing/playwright';
import { expect, test } from '@playwright/test';

import { consoleParts } from '../src/testing/consoleParts';
import { type Assert, emptyQueueFlow, tabSwitchFlow, triageFlow, validationFlow } from '../src/testing/scenarios';

// E2E adapter: build the engine from a real browser `page`. The scene (`consoleParts`) and the
// scenario flows are the SAME modules the DOM test imports — only this engine construction differs.
const assert: Assert = {
  // The scenarios compare primitives (counts, cell text), so `toBe` is the right matcher and is the
  // one Playwright surfaces on a generic value (its typed `toEqual` is narrowed for object asserts).
  equal: (actual, expected) => expect(actual).toBe(expected),
  isTrue: value => expect(value).toBe(true),
  match: (actual, pattern) => expect(actual ?? '').toMatch(pattern),
  includes: (haystack, needle) => expect(haystack ?? '').toContain(needle),
};

test.describe('Ticket triage console (E2E)', () => {
  test('triage flow: filter, reassign, save, see it reflected', async ({ page }) => {
    await page.goto('/');
    const engine = createTestEngine(page, consoleParts);
    await triageFlow(engine.parts.console, assert);
  });

  test('empty state: a queue with no tickets', async ({ page }) => {
    await page.goto('/');
    const engine = createTestEngine(page, consoleParts);
    await emptyQueueFlow(engine.parts.console, assert);
  });

  test('tab switch: All -> Overdue', async ({ page }) => {
    await page.goto('/');
    const engine = createTestEngine(page, consoleParts);
    await tabSwitchFlow(engine.parts.console, assert);
  });

  test('validation: clearing the required title blocks save', async ({ page }) => {
    await page.goto('/');
    const engine = createTestEngine(page, consoleParts);
    await validationFlow(engine.parts.console, assert);
  });
});
