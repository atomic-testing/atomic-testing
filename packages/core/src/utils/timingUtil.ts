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
   * Probe on an even grid instead: `probeCount` probes spread across `timeoutMs`,
   * plus a final probe on the timeout boundary. Supply this only when an even
   * cadence is what you want — leaving it unset selects the escalating default
   * described on {@link WaitUntilOption.probeIntervals}, which settles far sooner
   * for the same timeout. Ignored when `probeIntervals` is provided.
   */
  probeCount?: number;
  /**
   * Escalating waits (in milliseconds) between probes; the last entry repeats until
   * timeoutMs elapses. Suits "settle a re-render" waits where the condition usually
   * flips within milliseconds but may occasionally take much longer — probe densely
   * first, then back off. Takes precedence over probeCount, and applies by default
   * when neither is supplied.
   */
  probeIntervals?: readonly number[];
  /**
   * Whether it should log the conditional checks while waiting
   */
  debug?: boolean;
}

// The waits this library performs settle within milliseconds or not at all, while
// the timeouts guarding them are deliberately generous (30s for
// `waitUntilComponentState`). An even grid across such a timeout would not look
// again for 3 seconds, so probe densely first and back off. The last entry repeats,
// which is what bounds how late a satisfied condition can be noticed.
const defaultProbeIntervals: readonly number[] = [0, 10, 25, 50, 100];

/**
 * Keep running a probe function until it returns a value that matches the terminate condition or timeout
 */
export async function waitUntil<T>(option: WaitUntilOption<T>): Promise<T> {
  const { probeFn, terminateCondition, timeoutMs, probeCount, probeIntervals, debug } = option;
  // An explicit probeCount asks for the even grid; with neither knob supplied the
  // escalating default applies.
  const intervals = probeIntervals?.length ? probeIntervals : probeCount == null ? defaultProbeIntervals : undefined;
  // Only consulted on the even-grid path, which is reachable only when probeCount
  // was supplied; the fallback preserves the historic documented default.
  const intervalMs = timeoutMs / (probeCount ?? 10);

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

    const currentTime = Date.now();
    const elapsed = currentTime - startMs;

    if (elapsed >= timeoutMs) {
      break;
    }

    if (intervals !== undefined) {
      const interval = intervals[Math.min(probeIndex, intervals.length - 1)];
      probeIndex += 1;
      await wait(Math.min(interval, timeoutMs - elapsed));
    } else {
      // The next grid point strictly AFTER `elapsed`, so the wait is always
      // positive. `Math.round` landed in the PAST for the first half of every
      // window, making `wait()` resolve next-tick and the loop spin hot — a
      // timeoutMs of 1000 produced ~447 probes rather than 10. Deriving the slot
      // from actual elapsed time rather than a probe counter means a slow probe
      // skips ahead instead of firing a catch-up burst.
      //
      // Clamping to `timeoutMs` puts the final probe exactly on the boundary. The
      // `nextStart >= timeoutMs` break this replaces returned without ever looking
      // there, so the loop both ended early and had a dead zone at the end of its
      // own window: a condition satisfied at 240ms of a stated 250ms timeout was
      // reported as never satisfied.
      const nextStart = (Math.floor(elapsed / intervalMs) + 1) * intervalMs;
      await wait(Math.min(nextStart, timeoutMs) - elapsed);
    }
  }

  return val;
}
