import { TestFrameworkMapper } from '@atomic-testing/test-runner';

export const jestTestAdapter: TestFrameworkMapper = {
  assertEqual: (actual, expected) => expect(actual).toEqual(expected),
  describe: describe,
  beforeEach: beforeEach,
  afterEach: afterEach,
  beforeAll: beforeAll,
  afterAll: afterAll,
  test: test,
  it: test,
};
