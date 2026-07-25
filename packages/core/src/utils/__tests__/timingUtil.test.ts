import { waitUntil } from '../timingUtil';

/**
 * Runs a `waitUntil` whose condition is never met, so it always runs to the full timeout,
 * and reports how many times the probe was actually invoked.
 */
async function countProbesUntilTimeout(option: {
  timeoutMs: number;
  probeCount?: number;
  probeIntervals?: readonly number[];
}): Promise<{ probes: number; elapsedMs: number; result: boolean }> {
  let probes = 0;
  const startMs = Date.now();
  const result = await waitUntil({
    probeFn: () => {
      probes += 1;
      return false;
    },
    terminateCondition: true,
    ...option,
  });
  return { probes, elapsedMs: Date.now() - startMs, result };
}

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

  // Real timers on purpose. Faking them would make these assertions vacuous: the bug
  // being pinned is that `wait()` was handed a non-positive delay, and fake timers
  // resolve every delay instantly, so a hot-spinning loop and a throttled one look
  // identical. A bounded count under real timers is the honest check.
  describe('probeCount throttling', () => {
    test('should probe at most probeCount + 1 times across the timeout', async () => {
      const { probes, result } = await countProbesUntilTimeout({ timeoutMs: 1000 });

      expect(result).toBe(false);
      // The initial probe plus one per grid slot. Rounding to the *nearest* slot instead
      // of the next one made this ~44x higher, because half of every interval resolved
      // to a slot in the past and `wait` was called with 0 or a negative delay.
      expect(probes).toBeLessThanOrEqual(11);
      // A slow machine can overrun a sleep and skip a slot, so the floor is loose — it
      // only guards against the opposite regression of giving up after a probe or two.
      expect(probes).toBeGreaterThanOrEqual(5);
    });

    test('should honour an explicit probeCount', async () => {
      const { probes } = await countProbesUntilTimeout({ timeoutMs: 400, probeCount: 4 });

      expect(probes).toBeLessThanOrEqual(5);
      expect(probes).toBeGreaterThanOrEqual(2);
    });

    test('should use the whole timeout window rather than giving up an interval early', async () => {
      const { elapsedMs } = await countProbesUntilTimeout({ timeoutMs: 300 });

      // Rounding to the nearest slot used to break out half an interval before the
      // deadline (~285ms here), quietly shortening every caller's timeout.
      expect(elapsedMs).toBeGreaterThanOrEqual(295);
      expect(elapsedMs).toBeLessThan(600);
    });
  });

  describe('degenerate options', () => {
    test('should not spin when probeCount is zero or negative', async () => {
      for (const probeCount of [0, -5]) {
        const { probes, elapsedMs } = await countProbesUntilTimeout({ timeoutMs: 200, probeCount });

        // Clamped to a single interval spanning the timeout: probe now, probe at the end.
        expect(probes).toBeLessThanOrEqual(3);
        expect(elapsedMs).toBeLessThan(500);
      }
    });

    test('should treat a fractional probeCount as a fractional number of slots', async () => {
      const { probes } = await countProbesUntilTimeout({ timeoutMs: 400, probeCount: 2.5 });

      expect(probes).toBeLessThanOrEqual(4);
      expect(probes).toBeGreaterThanOrEqual(2);
    });

    test('should probe exactly once when the timeout is zero or negative', async () => {
      for (const timeoutMs of [0, -1]) {
        const { probes } = await countProbesUntilTimeout({ timeoutMs });

        expect(probes).toBe(1);
      }
    });

    test('should still terminate when probeIntervals contains negative entries', async () => {
      // Negative delays are meaningless, so they collapse to "probe immediately" rather
      // than reaching setTimeout, where a negative value would silently become 0 anyway.
      const { result, elapsedMs } = await countProbesUntilTimeout({
        timeoutMs: 100,
        probeIntervals: [-50, -10],
      });

      expect(result).toBe(false);
      expect(elapsedMs).toBeLessThan(400);
    });
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
      const { probes, elapsedMs, result } = await countProbesUntilTimeout({
        timeoutMs: 120,
        probeIntervals: [0, 10, 25],
      });

      expect(result).toBe(false);
      // 0 + 10 + 25 + 25 + 25 + 25 ... — more probes than the default cadence
      // (which would probe ~10 times here) is not required, but at least the
      // escalation sequence must have been walked past its last entry.
      expect(probes).toBeGreaterThanOrEqual(4);
      expect(elapsedMs).toBeLessThan(300);
    });

    test('should take precedence over probeCount', async () => {
      const { probes } = await countProbesUntilTimeout({
        timeoutMs: 100,
        probeCount: 1,
        probeIntervals: [0, 10],
      });

      // probeCount 1 alone would probe twice (interval = the whole timeout);
      // the escalating cadence probes every 0/10/10/...ms instead.
      expect(probes).toBeGreaterThan(5);
    });
  });
});
