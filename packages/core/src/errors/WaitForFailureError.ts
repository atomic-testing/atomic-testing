import { WaitForOption } from '../drivers/WaitForOption';
import { PartLocator } from '../locators';
import { getLocatorInfoForErrorLog } from '../utils/getLocatorInfoForErrorLog';
import { InteractorErrorBase } from './InteractorErrorBase';

export const WaitForFailureErrorId = 'WaitForFailureError';

function getErrorMessage(locator: PartLocator, option: WaitForOption): string {
  const selector = getLocatorInfoForErrorLog(locator);
  return `Wait for element to be ${option.condition} failed after ${option.timeoutMs}ms: ${selector}`;
}

/**
 * Thrown when `waitUntil`/`waitFor`-style polling (see `interactorUtil.interactorWaitUtil`)
 * times out before an element reaches the requested {@link WaitForOption.condition}
 * (`attached`, `detached`, `visible`, or `hidden`) — the element's actual state
 * never matched the expected one within `option.timeoutMs`.
 *
 * Per ADR-010 it carries only the serializable `locatorDescription` string
 * inherited from {@link InteractorErrorBase}, not the live locator.
 */
export class WaitForFailureError extends InteractorErrorBase {
  constructor(locator: PartLocator, option: WaitForOption) {
    super(getErrorMessage(locator, option), getLocatorInfoForErrorLog(locator));
    this.name = WaitForFailureErrorId;
  }
}
