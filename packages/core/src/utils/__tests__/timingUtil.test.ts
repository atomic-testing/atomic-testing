import { waitUntil } from '../timingUtil';

describe('waitUntil', () => {
  test('should respect timeout when condition is never met', async () => {
    const start = Date.now();
    const result = await waitUntil({
      probeFn: () => false,
      terminateCondition: true,
      timeoutMs: 100,
    });
    const elapsed = Date.now() - start;
    expect(result).toBe(false);
    // allow some buffer for timers but ensure it does not wait excessively
    expect(elapsed).toBeLessThan(200);
  });

  test('should resolve early when condition becomes true', async () => {
    let flag = false;
    setTimeout(() => {
      flag = true;
    }, 50);
    const start = Date.now();
    const result = await waitUntil({
      probeFn: () => flag,
      terminateCondition: true,
      timeoutMs: 500,
    });
    const elapsed = Date.now() - start;
    expect(result).toBe(true);
    // Should wait at least until flag turns true but not until timeout
    expect(elapsed).toBeGreaterThanOrEqual(50);
    expect(elapsed).toBeLessThan(200);
  });
});
