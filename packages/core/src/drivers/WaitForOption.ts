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

  debug: boolean;
}

export const defaultWaitForOption: Readonly<WaitForOption> = Object.freeze({
  condition: 'attached',
  timeoutMs: 30000,
  debug: false,
});
