import { WaitForOption } from '../drivers/WaitForOption';
import { PartLocator } from '../locators';
import { getLocatorInfoForErrorLog } from '../utils/locatorUtil';

export const WaitForFailureErrorId = 'WaitForFailureError';

function getErrorMessage(locator: PartLocator, option: WaitForOption): string {
  const selector = getLocatorInfoForErrorLog(locator);
  return `Wait for element to be ${option.condition} failed after ${option.timeoutMs}ms: ${selector}`;
}

export class WaitForFailureError extends Error {
  constructor(
    public readonly locator: PartLocator,
    option: WaitForOption
  ) {
    super(getErrorMessage(locator, option));
    this.name = WaitForFailureErrorId;
  }
}
