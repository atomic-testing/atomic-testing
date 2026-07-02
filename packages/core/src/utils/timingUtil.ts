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
   * The number of times to probe before timing out. The interval between probes is
   * calculated as timeoutMs / probeCount. Higher values mean more frequent checks.
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
 * Keep running a probe function until it returns a value that matches the terminate condition or timeout
 */
export async function waitUntil<T>(option: WaitUntilOption<T>): Promise<T> {
  const { probeFn, terminateCondition, timeoutMs, probeCount = 10, probeIntervals, debug } = option;
  const intervalMs = timeoutMs / probeCount;
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

    const currentTime = Date.now();
    const elapsed = currentTime - startMs;

    if (elapsed >= timeoutMs) {
      break;
    }

    if (hasEscalatingIntervals) {
      const interval = probeIntervals[Math.min(probeIndex, probeIntervals.length - 1)];
      probeIndex += 1;
      await wait(Math.min(interval, timeoutMs - elapsed));
    } else {
      const nextStart = Math.round(elapsed / intervalMs) * intervalMs;
      if (nextStart >= timeoutMs) {
        break;
      }
      await wait(nextStart - elapsed);
    }
  }

  return val;
}
