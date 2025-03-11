import { ScenePart, TestEngine } from '@atomic-testing/core';
import { E2eTestInterface, E2eTestRunEnvironmentFixture, TestFrameworkMapper } from '@atomic-testing/test-runner';
import { expect, Page, test } from '@playwright/test';

import { createTestEngine } from './createTestEngine';

export async function goto(url: string): Promise<void>;
export async function goto(url: string, fixture: E2eTestRunEnvironmentFixture): Promise<void>;
export async function goto(url: string, fixture?: E2eTestRunEnvironmentFixture): Promise<void> {
  const page = fixture!.page as Page;
  await page.goto(url);
}

export function playwrightGetTestEngine<T extends ScenePart>(
  scenePart: T,
  fixture: E2eTestRunEnvironmentFixture,
): TestEngine<T> {
  const page = fixture.page as Page;
  return createTestEngine(page, scenePart);
}

export const playWrightTestFrameworkMapper: TestFrameworkMapper = {
  assertEqual: (a, b) => expect(a).toEqual(b),
  // @ts-expect-error - expect type is not compatible with the type of the test framework
  describe: test.describe,

  beforeEach: test.beforeEach,
  afterEach: test.afterEach,
  beforeAll: test.beforeAll,
  afterAll: test.afterAll,

  // @ts-expect-error - expect type is not compatible with the type of the test framework
  test: test,

  // @ts-expect-error - expect type is not compatible with the type of the test framework
  it: test,
};

export function getTestRunnerInterface<T extends ScenePart>(): E2eTestInterface<T> {
  return {
    getTestEngine: playwrightGetTestEngine,
    goto,
  };
}
