import { TestFrameworkMapper } from '@atomic-testing/test-runner';
import { afterAll, afterEach, beforeAll, beforeEach, describe, test } from 'vitest';

export const jestTestAdapter: TestFrameworkMapper = {
  assertEqual: (actual, expected) => expect(actual).toEqual(expected),
  describe: describe,
  beforeEach: beforeEach,
  afterEach: afterEach,
  // @ts-expect-error
  beforeAll: beforeAll,
  // @ts-expect-error
  afterAll: afterAll,
  test: test,
  it: test,
};
