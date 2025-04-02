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
   * Whether it should log the conditional checks while waiting
   */
  debug?: boolean;
}

/**
 * Keep running a probe function until it returns a value that matches the terminate condition or timeout
 */
export async function waitUntil<T>(option: WaitUntilOption<T>): Promise<T> {
  const { probeFn, terminateCondition, timeoutMs, debug } = option;
  const maxProbeCount = 10;
  const intervalMs = timeoutMs / maxProbeCount;

  const eqCheck: (currentValue: T) => boolean =
    typeof terminateCondition === 'function'
      ? (terminateCondition as (currentValue: T) => boolean)
      : currentValue => terminateCondition === currentValue;

  const startMs = Date.now();
  const shouldContinue = true;
  let val: T;

  while (shouldContinue) {
    val = await probeFn();
    const hasMetEqCheck = eqCheck(val);
    if (debug) {
      // eslint-disable-next-line no-console
      console.log({ val, hasMetEqCheck });
    }

    if (hasMetEqCheck) {
      return val;
    }

    const currentTime = Date.now();
    const elapsed = currentTime - startMs;

    if (elapsed >= timeoutMs) {
      return val;
    }

    const nextStart = Math.round(elapsed / intervalMs) * intervalMs;
    if (nextStart - startMs >= timeoutMs) {
      return val;
    }
    await wait(nextStart);
  }

  return val!;
}
