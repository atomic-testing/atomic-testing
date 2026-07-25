/**
 * Wait a number of milliseconds
 * @param ms A number of milliseconds to wait
 * @returns
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

export interface WaitUntilOption<T> {
  /**
   * A function that returns a value or promised value to be checked against the terminate condition
   */
  probeFn: () => Promise<T> | T;
  /**
   * A value to check for equality or a function used for custom equality check
   */
  terminateCondition: T | ((currentValue: T) => boolean);
  /**
   * A number of milliseconds to wait before returning the last value
   */
  timeoutMs: number;
  /**
   * The number of evenly spaced probe slots to spread across the timeout; the interval
   * between probes is timeoutMs / probeCount. Higher values mean more frequent checks.
   * The first probe always happens immediately, so a wait that runs to the full timeout
   * costs probeCount + 1 probes. Values below 1 are treated as 1 — a zero or negative
   * step would collapse the cadence into a busy-wait.
   * Ignored when {@link WaitUntilOption.probeIntervals} is provided.
   * @default 10
   */
  probeCount?: number;
  /**
   * Escalating waits (in milliseconds) between probes; the last entry repeats until
   * timeoutMs elapses. Suits "settle a re-render" waits where the condition usually
   * flips within milliseconds but may occasionally take much longer — probe densely
   * first, then back off — whereas the probeCount cadence spreads probes evenly
   * across the full timeout. Takes precedence over probeCount.
   */
  probeIntervals?: readonly number[];
  /**
   * Whether it should log the conditional checks while waiting
   */
  debug?: boolean;
}

/**
 * Keep running a probe function until it returns a value that matches the terminate
 * condition or timeout. Never throws on timeout — it returns the value of the last probe,
 * leaving it to the caller to decide whether that constitutes a failure.
 */
export async function waitUntil<T>(option: WaitUntilOption<T>): Promise<T> {
  const { probeFn, terminateCondition, timeoutMs, probeCount = 10, probeIntervals, debug } = option;
  // Math.max keeps the grid step positive: probeCount <= 0 would otherwise produce an
  // infinite or backwards step, and every "sleep until the next slot" would resolve
  // immediately.
  const probeIntervalMs = timeoutMs / Math.max(probeCount, 1);
  const hasEscalatingIntervals = probeIntervals != null && probeIntervals.length > 0;

  const eqCheck: (currentValue: T) => boolean =
    typeof terminateCondition === 'function'
      ? (terminateCondition as (currentValue: T) => boolean)
      : currentValue => terminateCondition === currentValue;

  const startMs = Date.now();
  let val: T;
  let probeIndex = 0;

  while (true) {
    val = await probeFn();
    const hasMetEqCheck = eqCheck(val);
    if (debug) {
      // eslint-disable-next-line no-console
      console.log({ val, hasMetEqCheck });
    }

    if (hasMetEqCheck) {
      break;
    }

    const elapsed = Date.now() - startMs;

    if (elapsed >= timeoutMs) {
      break;
    }

    let requestedDelayMs: number;
    if (hasEscalatingIntervals) {
      requestedDelayMs = probeIntervals[Math.min(probeIndex, probeIntervals.length - 1)];
      probeIndex += 1;
    } else {
      // Floor-then-step lands on the next slot strictly in the future. Rounding to the
      // *nearest* slot instead picks one in the past for the first half of every
      // interval, so the delay came out zero or negative and the loop busy-waited at
      // setTimeout-0 speed — ~44x the requested probe count, and under
      // PlaywrightInteractor every one of those probes is a browser round-trip.
      requestedDelayMs = (Math.floor(elapsed / probeIntervalMs) + 1) * probeIntervalMs - elapsed;
    }

    // Both cadences share one clamp so the invariants live in a single place: never
    // sleep past the deadline, and never hand `wait` a negative duration (setTimeout
    // treats those as 0, which is how a busy-wait sneaks back in — a caller-supplied
    // negative entry in probeIntervals is degenerate, so it collapses to "probe now").
    await wait(Math.max(0, Math.min(requestedDelayMs, timeoutMs - elapsed)));
  }

  return val;
}
