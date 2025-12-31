import { ScenePart, TestEngine } from '@atomic-testing/core';
import {
  E2eTestInterface,
  E2eTestRunEnvironmentFixture,
  TestFrameworkMapper,
} from '@atomic-testing/internal-test-runner';
import { expect, Page, test } from '@playwright/test';

import { createTestEngine } from './createTestEngine';

/**
 * Navigate the current Playwright page to the provided URL.
 *
 * @param url - Destination URL to load.
 * @param fixture - Optional test fixture supplying the Playwright page.
 */
export async function goto(url: string): Promise<void>;
export async function goto(url: string, fixture: E2eTestRunEnvironmentFixture): Promise<void>;
export async function goto(url: string, fixture?: E2eTestRunEnvironmentFixture): Promise<void> {
  const page = fixture!.page as Page;
  await page.goto(url);
}

/**
 * Create a {@link TestEngine} bound to the Playwright page in the given fixture.
 *
 * @param scenePart - Scene definition to drive.
 * @param fixture - Fixture providing the Playwright page.
 */
export function playwrightGetTestEngine<T extends ScenePart>(
  scenePart: T,
  fixture: E2eTestRunEnvironmentFixture
): TestEngine<T> {
  const page = fixture.page as Page;
  return createTestEngine(page, scenePart);
}

/**
 * Playwright adapter for the TestFrameworkMapper interface.
 *
 * INTENTIONAL @ts-expect-error comments: Playwright's test functions have different type
 * signatures than the normalized TestFrameworkMapper interface. Playwright uses fixture-based
 * callbacks with destructuring ({ page, browser }) while our interface uses a union type for
 * Jest compatibility (done callback or fixture object). The functions are compatible at runtime
 * but TypeScript cannot verify this due to these fundamental signature differences.
 */
export const playWrightTestFrameworkMapper: TestFrameworkMapper = {
  assertEqual: (a, b) => expect(a).toEqual(b),
  assertNotEqual: (a, b) => expect(a).not.toEqual(b),
  assertTrue: (value) => expect(value).toBe(true),
  assertFalse: (value) => expect(value).toBe(false),
  assertApproxEqual: (actual, expected, tolerance) =>
    expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance),
  // @ts-expect-error - Playwright describe signature differs from TestFrameworkMapper.Describe
  describe: test.describe,

  beforeEach: test.beforeEach,
  afterEach: test.afterEach,
  beforeAll: test.beforeAll,
  afterAll: test.afterAll,

  // @ts-expect-error - Playwright test signature differs from TestFrameworkMapper.Test
  test: test,

  // @ts-expect-error - Playwright test signature differs from TestFrameworkMapper.Test
  it: test,
};

/**
 * Get a typed interface for running end-to-end tests with Playwright.
 */
export function getTestRunnerInterface<T extends ScenePart>(): E2eTestInterface<T> {
  return {
    getTestEngine: playwrightGetTestEngine,
    goto,
  };
}
