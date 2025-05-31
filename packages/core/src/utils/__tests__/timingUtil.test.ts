import { waitUntil } from '../timingUtil';

describe('waitUntil', () => {
  test('resolves when condition met', async () => {
    let counter = 0;
    const result = await waitUntil({
      probeFn: () => ++counter,
      terminateCondition: 3,
      timeoutMs: 500,
    });
    expect(result).toBe(3);
  });

  test('returns last value on timeout', async () => {
    const start = Date.now();
    const result = await waitUntil({
      probeFn: () => 0,
      terminateCondition: 1,
      timeoutMs: 100,
    });
    const duration = Date.now() - start;
    expect(result).toBe(0);
    expect(duration).toBeGreaterThanOrEqual(100);
  });
});
