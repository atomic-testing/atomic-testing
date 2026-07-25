export type WaitForCondition = 'attached' | 'visible' | 'detached' | 'hidden';

export interface WaitForOption {
  /**
   * The condition to wait for the component to reach
   * 'attached' - the component is attached to the DOM
   * 'detached' - the component is not attached to the DOM
   * 'visible' - the component is attached to the DOM and visible
   * 'hidden' - the component is attached to the DOM but not visible
   * @default 'attached'
   */
  condition: WaitForCondition;

  /**
   * The number of milliseconds to wait before timing out
   * @default 30000
   */
  timeoutMs: number;

  /**
   * Whether to log debug information during the wait operation.
   * When enabled, logs each probe's value and whether the condition was met.
   * @default false
   */
  debug: boolean;
}

export const defaultWaitForOption: Readonly<WaitForOption> = Object.freeze({
  condition: 'attached',
  timeoutMs: 30000,
  debug: false,
});

/**
 * The probe cadence component-state waits use, as `probeIntervals` for
 * `timingUtil.waitUntil`. Lives beside {@link defaultWaitForOption} because it is the
 * other half of the same default: that one says how long to wait, this one says how often
 * to look.
 *
 * The even `probeCount` cadence is wrong for this wait. It spreads its probes across the
 * whole budget, so with the 30s default timeout the second probe lands 3s in — a
 * component that appears in 50ms would be reported 3 seconds later. Element state instead
 * settles on a heavily skewed distribution: usually within a frame (a framework flush, a
 * microtask), occasionally after an animation, rarely after a network round-trip. So
 * probe densely first and back off.
 *
 * Each step at most doubles the previous one, which bounds detection latency at roughly
 * the settle time itself rather than at a fixed grid step, and the 500ms cap keeps the
 * long tail responsive. Measured against a 30s timeout: a condition flipping at 5ms is
 * seen ~1ms later, at 200ms ~58ms later, and a wait that genuinely runs the full 30s
 * costs ~70 probes.
 *
 * Precedence, strongest first: an explicit `probeIntervals` passed to a direct
 * `waitUntil` call; this constant, which component-state waits always pass; an
 * interactor-level default (`StorybookInteractor` sets one) that applies to direct
 * `waitUntil` calls supplying none.
 */
export const defaultSettleProbeIntervals: readonly number[] = Object.freeze([0, 1, 2, 4, 8, 16, 32, 64, 128, 256, 500]);
