import { PartLocator } from '../locators';
import { getLocatorInfoForErrorLog } from '../utils/getLocatorInfoForErrorLog';
import { InteractorErrorBase } from './InteractorErrorBase';

export const LocatorResolutionErrorId = 'LocatorResolutionError';

function getErrorMessage(locator: PartLocator, reason: string): string {
  const selector = getLocatorInfoForErrorLog(locator);
  return `Cannot resolve locator: ${reason}. Locator: ${selector}`;
}

/**
 * Error thrown when a {@link PartLocator} cannot be reduced to a CSS selector —
 * e.g. a {@link LinkedCssLocator} whose match target is absent, or a
 * `valueExtract` method the resolver does not implement.
 *
 * Lives in the interactor-level error hierarchy (ADR-010): it carries only a
 * serializable {@link locatorDescription} derived via
 * {@link getLocatorInfoForErrorLog}, so consumers that catch on
 * `InteractorErrorBase` see it alongside {@link ElementNotFoundError} rather than
 * a bare `Error` escaping the frozen contract (#1051).
 */
export class LocatorResolutionError extends InteractorErrorBase {
  constructor(locator: PartLocator, reason: string) {
    super(getErrorMessage(locator, reason), getLocatorInfoForErrorLog(locator));
    this.name = LocatorResolutionErrorId;
  }
}
