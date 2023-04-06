export type WaitForCondition = 'attached' | 'visible' | 'detached' | 'hidden';

export interface WaitForOption {
  condition: WaitForCondition;
  timeoutMs: number;
}

export const defaultWaitForOption: Readonly<WaitForOption> = Object.freeze({
  condition: 'attached',
  timeoutMs: 30000,
});
