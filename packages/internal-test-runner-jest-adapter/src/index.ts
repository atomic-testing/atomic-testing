import { TestFrameworkMapper } from '@atomic-testing/internal-test-runner';
import { afterAll, afterEach, beforeAll, beforeEach, describe, test, expect } from '@jest/globals';

/**
 * Jest adapter for the TestFrameworkMapper interface.
 *
 * INTENTIONAL @ts-ignore comments: Jest's `describe`, `test`, and `it` functions have
 * slightly different type signatures than the normalized TestFrameworkMapper interface.
 * The functions are compatible at runtime but TypeScript cannot verify this due to
 * differences in optional parameters, overloads, and return types between Jest's types
 * and our abstracted interface.
 */
export const jestTestAdapter: TestFrameworkMapper = {
  assertEqual: (actual, expected) => expect(actual).toEqual(expected),
  assertNotEqual: (actual, expected) => expect(actual).not.toEqual(expected),
  assertTrue: (value) => expect(value).toBe(true),
  assertFalse: (value) => expect(value).toBe(false),
  assertApproxEqual: (actual, expected, tolerance) =>
    expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance),
  // @ts-ignore - Jest describe signature differs from TestFrameworkMapper.Describe
  describe: describe,
  beforeEach: beforeEach,
  afterEach: afterEach,
  beforeAll: beforeAll,
  afterAll: afterAll,
  // @ts-ignore - Jest test signature differs from TestFrameworkMapper.Test
  test: test,
  // @ts-ignore - Jest test signature differs from TestFrameworkMapper.Test
  it: test,
};
