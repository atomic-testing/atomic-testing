import { PartLocator } from '../locators/PartLocator';

/**
 * Display a rough description of the locators for error logging
 * this is an estimate, not a precise description with the absence of interactor
 * locators such as LinkedCssLocator would not be interpreted correctly
 *
 * Lives in its own leaf module (imports only the locator model, never the error
 * hierarchy) so the interactor errors that build their `locatorDescription` from
 * it can depend on it without pulling in `locatorUtil` — which throws
 * {@link LocatorResolutionError} and would otherwise close a `locatorUtil ↔
 * error` import cycle.
 *
 * @param locator
 * @returns
 */
export function getLocatorInfoForErrorLog(locator: PartLocator): string {
  const locators = Array.isArray(locator) ? locator : [locator];

  const selectors: string[] = [];
  for (const loc of locators) {
    selectors.push(loc.selector);
  }

  return selectors.join(', ');
}
