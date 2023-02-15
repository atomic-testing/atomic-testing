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
