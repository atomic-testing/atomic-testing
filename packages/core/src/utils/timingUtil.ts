/**
 * Wait a number of milliseconds
 * @param ms A number of milliseconds to wait
 * @returns
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

/**
 * Keep running a probe function until it returns a value that matches the terminate condition or timeout
 * @param probeFn A function that returns a value or promised value to be checked against the terminate condition
 * @param terminateCondition A value to check for equality or a function used for custom equality check
 * @param timeoutMs A number of milliseconds to wait before returning the last value
 * @returns The last value returned by the probe function
 */
export async function waitUntil<T>(
  probeFn: () => Promise<T> | T,
  terminateCondition: T | ((currentValue: T) => boolean),
  timeoutMs: number,
): Promise<T> {
  const maxProbeCount = 10;
  const intervalMs = timeoutMs / maxProbeCount;

  // @ts-ignore
  const eqCheck: (currentValue: T) => boolean =
    typeof terminateCondition === 'function'
      ? terminateCondition
      : (currentValue) => terminateCondition === currentValue;

  const startMs = Date.now();
  const shouldContinue = true;
  let val: T;

  while (shouldContinue) {
    val = await probeFn();
    if (eqCheck(val)) {
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

    await wait(nextStart - currentTime);
  }

  return val!;
}
