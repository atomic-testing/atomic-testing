import { defaultSettleProbeIntervals, defaultWaitForOption } from '../../drivers/WaitForOption';
import { WaitForFailureError } from '../../errors/WaitForFailureError';
import { Interactor } from '../../interactor/Interactor';
import { byDataTestId } from '../../locators/byDataTestId';
import { interactorWaitUtil } from '../interactorUtil';
import { waitUntil, WaitUntilOption } from '../timingUtil';

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
  // Defined as a real method plus jest.spyOn, not assigned as a mock-function
  // property: the skill-sync scaffolder's coreSymbolExists check
  // (scripts/skills/skillClaims.mjs) scans this package's whole source tree,
  // tests included, as flat text. A property-style assignment for `waitUntil`
  // reads as a real member declaration to that scanner the same way it would
  // in production source, while a method-shorthand definition is the form it
  // already expects the genuine Interactor member to take.
  const interactor = {
    exists,
    isVisible,
    async waitUntil(option: WaitUntilOption<boolean>) {
      return option.probeFn();
    },
  } as unknown as Interactor;
  jest.spyOn(interactor, 'waitUntil');

  return interactor;
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

/**
 * An interactor whose `waitUntil` is the real probe loop rather than a single-shot stub,
 * so these tests measure the cadence component-state waits actually run at. `exists`
 * reports whatever `isPresent` currently returns, letting a test flip the element into
 * existence partway through the wait.
 */
function createProbingInteractor(isPresent: () => boolean): {
  interactor: Interactor;
  probeCount: () => number;
  lastWaitUntilOption: () => WaitUntilOption<boolean> | undefined;
} {
  let probes = 0;
  let lastOption: WaitUntilOption<boolean> | undefined;
  const probe = async (): Promise<boolean> => {
    probes += 1;
    return isPresent();
  };
  const interactor = {
    exists: probe,
    isVisible: probe,
    async waitUntil(option: WaitUntilOption<boolean>) {
      lastOption = option;
      return waitUntil(option);
    },
  } as unknown as Interactor;

  return { interactor, probeCount: () => probes, lastWaitUntilOption: () => lastOption };
}

describe('interactorWaitUtil probe cadence', () => {
  it('names its own escalating cadence instead of inheriting the even probeCount grid', async () => {
    const interactor = createInteractor(true);

    await interactorWaitUtil(locator, interactor);

    expect(interactor.waitUntil).toHaveBeenCalledWith(
      expect.objectContaining({ probeIntervals: defaultSettleProbeIntervals })
    );
  });

  it('observes a condition that flips early without waiting out a multi-second grid step', async () => {
    // The regression this guards: with the 30s default timeout, the even cadence puts the
    // second probe 3s in, so this wait would take ~3050ms instead of ~50ms.
    let present = false;
    setTimeout(() => {
      present = true;
    }, 50);
    const { interactor } = createProbingInteractor(() => present);

    const start = Date.now();
    await interactorWaitUtil(locator, interactor);
    const elapsedMs = Date.now() - start;

    expect(elapsedMs).toBeGreaterThanOrEqual(50);
    expect(elapsedMs).toBeLessThan(500);
  });

  it('still terminates at the timeout with a bounded probe count when the condition never holds', async () => {
    const { interactor, probeCount } = createProbingInteractor(() => false);

    const start = Date.now();
    await expect(interactorWaitUtil(locator, interactor, { timeoutMs: 300 })).rejects.toThrow(WaitForFailureError);
    const elapsedMs = Date.now() - start;

    expect(elapsedMs).toBeGreaterThanOrEqual(295);
    expect(elapsedMs).toBeLessThan(700);
    // Escalating to the 500ms tail costs ~11 probes across 300ms; the pre-fix busy-wait
    // burned hundreds. The ceiling is what matters — a slow machine only probes less.
    expect(probeCount()).toBeLessThanOrEqual(20);
  });

  it('overrides an interactor-level default cadence, which is the intended precedence', async () => {
    // StorybookInteractor composes its own default as
    // `super.waitUntil({ probeIntervals: <its own>, ...option })`, so an option that
    // carries probeIntervals wins. Component-state waits are meant to win: their cadence
    // is tuned for element state specifically, and it is denser early than any
    // interactor-wide default.
    const interactorDefault = [0, 20, 50, 100, 100, 500];
    let received: WaitUntilOption<boolean> | undefined;
    const interactor = {
      exists: async () => true,
      isVisible: async () => true,
      async waitUntil(option: WaitUntilOption<boolean>) {
        received = { probeIntervals: interactorDefault, ...option };
        return waitUntil(received);
      },
    } as unknown as Interactor;

    await interactorWaitUtil(locator, interactor);

    expect(received?.probeIntervals).toBe(defaultSettleProbeIntervals);
  });
});
