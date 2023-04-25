import { ComponentDriver } from '../drivers/ComponentDriver';
import { WaitForOption } from '../drivers/WaitForOption';
import { PartLocator } from '../locators';
import { toCssSelector } from '../utils/locatorUtil';
import { ErrorBase } from './ErrorBase';

export const WaitForFailureErrorId = 'WaitForFailureError';

function getErrorMessage(locator: PartLocator, option: WaitForOption): string {
  const cssLocator = toCssSelector(locator);
  return `Wait for element to be ${option.condition} failed after ${option.timeoutMs}ms: ${cssLocator}`;
}

export class WaitForFailureError extends ErrorBase {
  constructor(
    public readonly locator: PartLocator,
    option: WaitForOption,
    public readonly driver: ComponentDriver<any>,
  ) {
    super(getErrorMessage(locator, option), driver);
    this.name = WaitForFailureErrorId;
  }
}
