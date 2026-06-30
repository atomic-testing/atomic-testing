/**
 * Base class for errors thrown at the interactor level, where no
 * `ComponentDriver` is available — only the locator that was being resolved.
 *
 * Carries a **serializable** `locatorDescription` string rather than a live
 * `PartLocator`, so the frozen, catchable error contract stays decoupled from the
 * locator model and callers cannot reach locator internals through a caught
 * error. Subclasses compute the description from the locator via
 * `getLocatorInfoForErrorLog`. See ADR-010.
 */
export class InteractorErrorBase extends Error {
  constructor(
    message: string,
    public readonly locatorDescription: string
  ) {
    super(message);
  }
}
