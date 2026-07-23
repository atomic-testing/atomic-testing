import { defaultWaitForOption } from '../../drivers/WaitForOption';
import { WaitForFailureError } from '../../errors/WaitForFailureError';
import { Interactor } from '../../interactor/Interactor';
import { byDataTestId } from '../../locators/byDataTestId';
import { interactorWaitUtil } from '../interactorUtil';
import { WaitUntilOption } from '../timingUtil';

const locator = byDataTestId('spinner');

/**
 * A minimal Interactor test double: only the facet interactorWaitUtil actually
 * calls (`exists`/`isVisible`/`waitUntil`) is implemented, the rest of the large
 * Interactor surface is irrelevant to this unit. `waitUntil` runs its `probeFn`
 * exactly once and returns that value — standing in for the real probe loop
 * (already covered by timingUtil's own tests) so these tests isolate
 * interactorWaitUtil's own logic: which method backs each condition, and how a
 * probe outcome that never matches becomes a WaitForFailureError.
 */
function createInteractor(probeResult: boolean): Interactor {
  const exists = jest.fn().mockResolvedValue(probeResult);
  const isVisible = jest.fn().mockResolvedValue(probeResult);
  const waitUntil = jest.fn(async (option: WaitUntilOption<boolean>) => option.probeFn());

  return { exists, isVisible, waitUntil } as unknown as Interactor;
}

describe('interactorWaitUtil', () => {
  it('defaults to the "attached" condition, probing exists() for true', async () => {
    const interactor = createInteractor(true);

    await interactorWaitUtil(locator, interactor);

    expect(interactor.waitUntil).toHaveBeenCalledWith(
      expect.objectContaining({ terminateCondition: true, probeFn: expect.any(Function) })
    );
    expect(interactor.exists).toHaveBeenCalledWith(locator);
    expect(interactor.isVisible).not.toHaveBeenCalled();
  });

  it('probes exists() for false under the "detached" condition', async () => {
    const interactor = createInteractor(false);

    await interactorWaitUtil(locator, interactor, { condition: 'detached' });

    expect(interactor.waitUntil).toHaveBeenCalledWith(expect.objectContaining({ terminateCondition: false }));
    expect(interactor.exists).toHaveBeenCalledWith(locator);
  });

  it('probes isVisible() for true under the "visible" condition', async () => {
    const interactor = createInteractor(true);

    await interactorWaitUtil(locator, interactor, { condition: 'visible' });

    expect(interactor.waitUntil).toHaveBeenCalledWith(expect.objectContaining({ terminateCondition: true }));
    expect(interactor.isVisible).toHaveBeenCalledWith(locator);
    expect(interactor.exists).not.toHaveBeenCalled();
  });

  it('probes isVisible() for false under the "hidden" condition', async () => {
    const interactor = createInteractor(false);

    await interactorWaitUtil(locator, interactor, { condition: 'hidden' });

    expect(interactor.waitUntil).toHaveBeenCalledWith(expect.objectContaining({ terminateCondition: false }));
    expect(interactor.isVisible).toHaveBeenCalledWith(locator);
  });

  it('merges a partial option over defaultWaitForOption before delegating to waitUntil', async () => {
    const interactor = createInteractor(true);

    await interactorWaitUtil(locator, interactor, { timeoutMs: 5000 });

    expect(interactor.waitUntil).toHaveBeenCalledWith(
      expect.objectContaining({ timeoutMs: 5000, debug: defaultWaitForOption.debug })
    );
  });

  it('resolves without throwing when the probe reaches the expected state', async () => {
    const interactor = createInteractor(true);

    await expect(interactorWaitUtil(locator, interactor)).resolves.toBeUndefined();
  });

  it('throws WaitForFailureError when the probe never reaches the expected state', async () => {
    // waitUntil() returning anything other than `expected` models a real timeout:
    // the probe loop gave up without the terminate condition ever being met.
    const interactor = createInteractor(false);

    await expect(interactorWaitUtil(locator, interactor)).rejects.toThrow(WaitForFailureError);
  });

  it('includes the condition, timeout, and locator in the thrown error', async () => {
    const interactor = createInteractor(false);

    await expect(interactorWaitUtil(locator, interactor, { timeoutMs: 1234 })).rejects.toThrow(
      'Wait for element to be attached failed after 1234ms: [data-testid="spinner"]'
    );
  });
});
