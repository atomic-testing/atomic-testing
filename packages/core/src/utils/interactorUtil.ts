import { defaultSettleProbeIntervals, defaultWaitForOption, WaitForOption } from '../drivers/WaitForOption';
import { WaitForFailureError } from '../errors/WaitForFailureError';
import { Interactor } from '../interactor/Interactor';
import { PartLocator } from '../locators/PartLocator';

/**
 * Wait until the element reaches the desired condition.  By default, it waits until the element is attached to the DOM.
 * @param locator The locator of the element to wait for
 * @param interactor The interactor to use to wait for the element
 * @param option Optional parameters to customize the wait behavior
 */
export async function interactorWaitUtil(
  locator: PartLocator,
  interactor: Interactor,
  option: Partial<Readonly<WaitForOption>> = defaultWaitForOption
): Promise<void> {
  const actualOption = { ...defaultWaitForOption, ...option };
  let probeFn: () => Promise<boolean>;
  let expected: boolean;
  switch (actualOption.condition) {
    case 'hidden':
      probeFn = () => interactor.isVisible(locator);
      expected = false;
      break;
    case 'detached':
      probeFn = () => interactor.exists(locator);
      expected = false;
      break;
    case 'visible':
      probeFn = () => interactor.isVisible(locator);
      expected = true;
      break;
    default: // 'attached'
      probeFn = () => interactor.exists(locator);
      expected = true;
      break;
  }

  const actual = await interactor.waitUntil({
    probeFn,
    terminateCondition: expected,
    timeoutMs: actualOption.timeoutMs,
    // Element state settles far sooner than the timeout budget it is allowed, so this
    // wait always names its own cadence rather than inheriting the even probeCount grid
    // (which would put the second probe 3s into the 30s default). See
    // defaultSettleProbeIntervals for the cadence and its precedence.
    probeIntervals: defaultSettleProbeIntervals,
    debug: actualOption.debug,
  });
  if (actual !== expected) {
    throw new WaitForFailureError(locator, actualOption);
  }
}
