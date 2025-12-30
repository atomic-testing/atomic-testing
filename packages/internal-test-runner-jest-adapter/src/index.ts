import { TestFrameworkMapper } from '@atomic-testing/internal-test-runner';
import { afterAll, afterEach, beforeAll, beforeEach, describe, test, expect } from '@jest/globals';

export const jestTestAdapter: TestFrameworkMapper = {
  assertEqual: (actual, expected) => expect(actual).toEqual(expected),
  assertNotEqual: (actual, expected) => expect(actual).not.toEqual(expected),
  assertTrue: (value) => expect(value).toBe(true),
  assertFalse: (value) => expect(value).toBe(false),
  assertApproxEqual: (actual, expected, tolerance) =>
    expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance),
  // @ts-ignore
  describe: describe,
  beforeEach: beforeEach,
  afterEach: afterEach,
  beforeAll: beforeAll,
  afterAll: afterAll,
  // @ts-ignore
  test: test,
  // @ts-ignore
  it: test,
};
