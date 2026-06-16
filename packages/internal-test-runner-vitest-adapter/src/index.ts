import { TestFrameworkMapper } from '@atomic-testing/internal-test-runner';
import { afterAll, afterEach, beforeAll, beforeEach, describe, test, expect } from 'vitest';

/**
 * Vitest adapter for the TestFrameworkMapper interface.
 *
 * As of Vitest 4, the lifecycle hook signatures align with the normalized
 * TestFrameworkMapper interface, so no @ts-expect-error suppression is needed.
 */
export const vitestAdapter: TestFrameworkMapper = {
  assertEqual: (actual, expected) => expect(actual).toEqual(expected),
  assertNotEqual: (actual, expected) => expect(actual).not.toEqual(expected),
  assertTrue: value => expect(value).toBe(true),
  assertFalse: value => expect(value).toBe(false),
  assertApproxEqual: (actual, expected, tolerance) =>
    expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance),
  describe: describe,
  beforeEach: beforeEach,
  afterEach: afterEach,
  beforeAll: beforeAll,
  afterAll: afterAll,
  test: test,
  it: test,
};
