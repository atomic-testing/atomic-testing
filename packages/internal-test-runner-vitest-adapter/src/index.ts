import { TestFrameworkMapper } from '@atomic-testing/internal-test-runner';
import { afterAll, afterEach, beforeAll, beforeEach, describe, test, expect } from 'vitest';

/**
 * Vitest adapter for the TestFrameworkMapper interface.
 *
 * INTENTIONAL @ts-expect-error comments: Vitest's lifecycle hooks have slightly different
 * type signatures than the normalized TestFrameworkMapper interface. The functions are
 * compatible at runtime but TypeScript cannot verify this due to differences in optional
 * parameters, overloads, and return types between Vitest's types and our abstracted interface.
 */
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
  // @ts-expect-error - Vitest beforeAll signature differs from TestFrameworkMapper.LifeCycleHook
  beforeAll: beforeAll,
  // @ts-expect-error - Vitest afterAll signature differs from TestFrameworkMapper.LifeCycleHook
  afterAll: afterAll,
  test: test,
  it: test,
};
