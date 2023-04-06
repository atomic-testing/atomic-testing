import { WaitForOption } from '../drivers/WaitForOption';
import { LocatorChain } from '../locators';
import { toCssSelector } from '../utils/locatorUtil';

export const WaitForFailureErrorId = 'WaitForFailureError';

function getErrorMessage(locator: LocatorChain, option: WaitForOption): string {
  const cssLocator = toCssSelector(locator);
  return `Wait for element to be ${option.condition} failed after ${option.timeoutMs}ms: ${cssLocator}`;
}

export class WaitForFailureError extends Error {
  constructor(public readonly locator: LocatorChain, option: WaitForOption) {
    super(getErrorMessage(locator, option));
    this.name = WaitForFailureErrorId;
  }
}
