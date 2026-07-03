import { AngularAppStability } from './types';

/**
 * Default upper bound for a single settle step. See
 * {@link AngularInteractorOption.settleTimeoutMs}.
 */
export const defaultSettleTimeoutMs = 3000;

function macrotaskDelay(ms: number): Promise<void> {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

/**
 * Wait for an Angular application to finish reacting to the previous
 * interaction (or its initial render).
 *
 * With an `ApplicationRef`, awaits `whenStable()` — which resolves once
 * change detection is idle under both zone.js and zoneless change detection —
 * bounded by `timeoutMs`, because `whenStable()` never resolves for apps that
 * never stabilize (e.g. `setInterval` polling) and a settle step must not
 * deadlock. Without one (pre-rendered engines), yields a single macrotask so
 * already-scheduled change detection can run; genuinely asynchronous updates
 * are covered by the polling `waitUntil` path.
 */
export async function settleAppStability(
  appStability: AngularAppStability | undefined,
  timeoutMs: number = defaultSettleTimeoutMs
): Promise<void> {
  if (appStability == null) {
    await macrotaskDelay(0);
    return;
  }
  await Promise.race([appStability.whenStable(), macrotaskDelay(timeoutMs)]);
}
