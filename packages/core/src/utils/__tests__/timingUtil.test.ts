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
});
