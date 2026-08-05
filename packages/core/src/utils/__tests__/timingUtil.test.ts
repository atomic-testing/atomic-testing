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
    // Deliberately off any probe boundary, so which probe observes the flip is
    // unambiguous rather than a race between the flip's timer and a probe due at
    // the same instant.
    setTimeout(() => {
      flag = true;
    }, 30);
    const start = Date.now();
    const result = await waitUntil({
      probeFn: () => flag,
      terminateCondition: true,
      timeoutMs: 500,
    });
    const elapsed = Date.now() - start;
    expect(result).toBe(true);
    // Should wait at least until flag turns true but not until timeout
    expect(elapsed).toBeGreaterThanOrEqual(30);
    expect(elapsed).toBeLessThan(200);
  });

  test('should honour the full timeout when the condition is never met', async () => {
    const start = Date.now();
    await waitUntil({ probeFn: () => false, terminateCondition: true, timeoutMs: 100 });
    // The old cadence stopped as soon as the NEXT probe would have landed on or
    // past the timeout, giving up at ~95ms of a stated 100ms.
    expect(Date.now() - start).toBeGreaterThanOrEqual(100);
  });

  test('should not busy-spin: an even grid probes about as often as asked', async () => {
    let probes = 0;
    await waitUntil({
      probeFn: () => {
        probes += 1;
        return false;
      },
      terminateCondition: true,
      timeoutMs: 200,
      probeCount: 4,
    });
    // 4 grid probes plus one on the boundary. The old `Math.round` cadence
    // computed a next-probe time in the PAST for the first half of every window,
    // so `wait()` resolved next-tick and this produced ~100 probes.
    expect(probes).toBeLessThanOrEqual(6);
    expect(probes).toBeGreaterThanOrEqual(2);
  });

  test('should still observe a condition satisfied just before the timeout', async () => {
    let flag = false;
    setTimeout(() => {
      flag = true;
    }, 240);
    const result = await waitUntil({
      probeFn: () => flag,
      terminateCondition: true,
      timeoutMs: 250,
      probeCount: 10,
    });
    // The window's last 5% used to be a dead zone: the loop stopped before ever
    // probing there, so a condition that became true inside the stated timeout was
    // reported as never satisfied.
    expect(result).toBe(true);
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

    test('should apply the escalating default when neither knob is supplied', async () => {
      let flag = false;
      setTimeout(() => {
        flag = true;
      }, 5);
      const start = Date.now();
      const result = await waitUntil({ probeFn: () => flag, terminateCondition: true, timeoutMs: 30000 });
      expect(result).toBe(true);
      // The generous timeout is the point: an even grid would divide it into ten
      // 3-second slots and not look again until t=3000. The default has to settle
      // in milliseconds without falling back on the busy-spin that used to make it.
      expect(Date.now() - start).toBeLessThan(200);
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
