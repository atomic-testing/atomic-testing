import { Interactor, PartLocator } from '@atomic-testing/core';

/**
 * Default open/close transition budget (ms) for the dialog wait helpers — shared
 * by `DialogDriver` and `AlertDialogDriver` so the two stay in step.
 */
export const OVERLAY_TRANSITION_MS = 250;

/** Whether a native `<dialog>` is open — its `open` attribute, set by `showModal()`. */
export function isDialogOpen(interactor: Interactor, locator: PartLocator): Promise<boolean> {
  return interactor.hasAttribute(locator, 'open');
}

/**
 * Wait until the dialog's open state equals `expected`, returning whether that
 * state was reached within `timeoutMs`.
 */
export async function waitForDialogOpenState(
  interactor: Interactor,
  locator: PartLocator,
  expected: boolean,
  timeoutMs: number
): Promise<boolean> {
  const result = await interactor.waitUntil({
    probeFn: () => isDialogOpen(interactor, locator),
    terminateCondition: expected,
    timeoutMs,
  });
  return result === expected;
}
