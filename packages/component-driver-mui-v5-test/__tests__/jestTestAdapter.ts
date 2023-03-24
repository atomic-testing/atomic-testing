import { TestInterface } from '@atomic-testing/core';

const emptyGoto = (url: string) => {};

export const jestTestAdapter: TestInterface = {
  assertEqual: (actual, expected) => expect(actual).toEqual(expected),
  describe: describe,
  beforeEach: beforeEach,
  afterEach: afterEach,
  beforeAll: beforeAll,
  afterAll: afterAll,
  test: test,
  it: test,
  goto: emptyGoto,
  visit: emptyGoto,
};
