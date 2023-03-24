import { ScenePart, TestEngine, TestInterface } from '@atomic-testing/core';
import { createTestEngine } from '@atomic-testing/playwright';
import { expect, Page, test } from '@playwright/test';

function goto(url: string, fixture: any) {
  const page = fixture.page as Page;
  return page.goto(url);
}

export function playwrightGetTestEngine<T extends ScenePart>(scenePart: T, fixture: any): TestEngine<T> {
  const page = fixture.page as Page;
  return createTestEngine(page, scenePart);
}

export const playWrightTestAdapter: TestInterface = {
  assertEqual: (a, b) => expect(a).toEqual(b),
  // @ts-ignore
  describe: test.describe,
  beforeEach: test.beforeEach,
  afterEach: test.afterEach,
  beforeAll: test.beforeAll,
  afterAll: test.afterAll,
  // @ts-ignore
  test: test,

  // @ts-ignore
  it: test,

  // @ts-ignore
  goto: goto,

  // @ts-ignore
  visit: goto,
};
