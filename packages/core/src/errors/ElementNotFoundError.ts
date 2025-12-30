import { PartLocator } from '../locators';
import { getLocatorInfoForErrorLog } from '../utils/locatorUtil';

export const ElementNotFoundErrorId = 'ElementNotFoundError';

function getErrorMessage(locator: PartLocator, action: string): string {
  const selector = getLocatorInfoForErrorLog(locator);
  return `Cannot ${action}: element not found. Locator: ${selector}`;
}

/**
 * Error thrown when an interactor method is called on an element that does not exist.
 * This error is thrown at the interactor level and does not require a ComponentDriver reference.
 */
export class ElementNotFoundError extends Error {
  constructor(
    public readonly locator: PartLocator,
    public readonly action: string
  ) {
    super(getErrorMessage(locator, action));
    this.name = ElementNotFoundErrorId;
  }
}
