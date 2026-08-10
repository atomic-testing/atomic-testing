import { ErrorBase } from './ErrorBase';

export const PostconditionNotMetErrorId = 'PostconditionNotMetError';

/**
 * Thrown when a driver action's own postcondition did not hold within its
 * timeout — see {@link ComponentDriver.awaitPostcondition}.
 *
 * This error exists to make an unmet postcondition **loud at its cause**. The
 * alternative — letting the action resolve anyway — surfaces later as a
 * baffling read result (`Expected: "Banana" / Received: null`) attributed to
 * the assertion rather than to the action that never finished, which is exactly
 * the diagnosis cost this class removes.
 *
 * Per ADR-010 it retains only the serializable `driverName` inherited from
 * {@link ErrorBase} plus the human-readable {@link postcondition} description —
 * never a live driver, locator, or probe.
 *
 * @param driver Anything name-bearing (a driver satisfies `{ driverName }`);
 *   only its `driverName` is retained.
 * @param postcondition Human-readable description of what was awaited, phrased
 *   as the state that failed to arrive (e.g. `"selectByLabel('Banana'): the
 *   dropdown to close with the selection committed"`).
 * @param timeoutMs How long it was awaited before giving up.
 */
export class PostconditionNotMetError extends ErrorBase {
  readonly postcondition: string;

  constructor(driver: { driverName: string }, postcondition: string, timeoutMs: number) {
    super(`Postcondition not met after ${timeoutMs}ms — waited for ${postcondition}`, driver);
    this.postcondition = postcondition;
    this.name = PostconditionNotMetErrorId;
  }
}
