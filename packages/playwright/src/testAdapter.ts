import { ScenePart, TestEngine } from '@atomic-testing/core';
import { E2eTestRunEnvironmentFixture, TestFrameworkMapper } from '@atomic-testing/test-runner';
import { expect, Page, test } from '@playwright/test';

import { createTestEngine } from './createTestEngine';

export async function goto(url: string, fixture: E2eTestRunEnvironmentFixture): Promise<void> {
  const page = fixture.page as Page;
  await page.goto(url);
}

export function playwrightGetTestEngine<T extends ScenePart>(
  scenePart: T,
  fixture: E2eTestRunEnvironmentFixture,
): TestEngine<T> {
  const page = fixture.page as Page;
  return createTestEngine(page, scenePart);
}

export const playWrightTestAdapter: TestFrameworkMapper = {
  assertEqual: (a, b) => expect(a).toEqual(b),
  // @ts-ignore
  describe: test.describe,

  /* eslint-disable @typescript-eslint/unbound-method */
  beforeEach: test.beforeEach,
  afterEach: test.afterEach,
  beforeAll: test.beforeAll,
  afterAll: test.afterAll,
  /* eslint-enable @typescript-eslint/unbound-method */

  // @ts-ignore
  test: test,

  // @ts-ignore
  it: test,
};
