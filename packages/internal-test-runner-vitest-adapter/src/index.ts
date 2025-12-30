import { TestFrameworkMapper } from '@atomic-testing/internal-test-runner';
import { afterAll, afterEach, beforeAll, beforeEach, describe, test, expect } from 'vitest';

export const vitestAdapter: TestFrameworkMapper = {
  assertEqual: (actual, expected) => expect(actual).toEqual(expected),
  assertNotEqual: (actual, expected) => expect(actual).not.toEqual(expected),
  assertTrue: (value) => expect(value).toBe(true),
  assertFalse: (value) => expect(value).toBe(false),
  assertApproxEqual: (actual, expected, tolerance) =>
    expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance),
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
