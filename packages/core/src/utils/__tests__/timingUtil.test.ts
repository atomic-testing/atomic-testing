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

  describe('probeIntervals', () => {
    test('should probe densely first: a fast condition resolves in a few milliseconds', async () => {
      let flag = false;
      setTimeout(() => {
        flag = true;
      }, 5);
      const start = Date.now();
      const result = await waitUntil({
        probeFn: () => flag,
        terminateCondition: true,
        timeoutMs: 30000,
        probeIntervals: [0, 20, 50, 100, 100, 500],
      });
      const elapsed = Date.now() - start;
      expect(result).toBe(true);
      // With the probeCount cadence this would sleep timeoutMs/10 = 3s before
      // the second probe; the escalating cadence re-probes within ~70ms.
      expect(elapsed).toBeLessThan(200);
    });

    test('should repeat the last interval and still respect timeout', async () => {
      let probes = 0;
      const start = Date.now();
      const result = await waitUntil({
        probeFn: () => {
          probes += 1;
          return false;
        },
        terminateCondition: true,
        timeoutMs: 120,
        probeIntervals: [0, 10, 25],
      });
      const elapsed = Date.now() - start;
      expect(result).toBe(false);
      // 0 + 10 + 25 + 25 + 25 + 25 ... — more probes than the default cadence
      // (which would probe ~10 times here) is not required, but at least the
      // escalation sequence must have been walked past its last entry.
      expect(probes).toBeGreaterThanOrEqual(4);
      expect(elapsed).toBeLessThan(300);
    });

    test('should take precedence over probeCount', async () => {
      let probes = 0;
      await waitUntil({
        probeFn: () => {
          probes += 1;
          return false;
        },
        terminateCondition: true,
        timeoutMs: 100,
        probeCount: 1,
        probeIntervals: [0, 10],
      });
      // probeCount 1 alone would stop after ~2 probes (interval = 100ms);
      // the escalating cadence probes every 0/10/10/...ms instead.
      expect(probes).toBeGreaterThan(5);
    });
  });
});
