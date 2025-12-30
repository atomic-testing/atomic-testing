import { WaitForOption } from '../drivers/WaitForOption';
import { PartLocator } from '../locators';
import { getLocatorInfoForErrorLog } from '../utils/locatorUtil';

import { InteractorErrorBase } from './InteractorErrorBase';

export const WaitForFailureErrorId = 'WaitForFailureError';

function getErrorMessage(locator: PartLocator, option: WaitForOption): string {
  const selector = getLocatorInfoForErrorLog(locator);
  return `Wait for element to be ${option.condition} failed after ${option.timeoutMs}ms: ${selector}`;
}

export class WaitForFailureError extends InteractorErrorBase {
  constructor(
    locator: PartLocator,
    option: WaitForOption
  ) {
    super(getErrorMessage(locator, option), locator);
    this.name = WaitForFailureErrorId;
  }
}
