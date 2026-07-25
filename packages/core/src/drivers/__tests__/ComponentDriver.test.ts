import { Interactor } from '../../interactor/Interactor';
import { byDataTestId } from '../../locators/byDataTestId';
import type { PartLocator } from '../../locators/PartLocator';
import { IComponentDriverOption, ScenePart } from '../../partTypes';
import { ComponentDriver } from '../ComponentDriver';

class LeafDriver extends ComponentDriver {
  get driverName(): string {
    return 'LeafDriver';
  }
}

const parts = {
  first: { locator: byDataTestId('first'), driver: LeafDriver },
  second: { locator: byDataTestId('second'), driver: LeafDriver },
  third: { locator: byDataTestId('third'), driver: LeafDriver },
} satisfies ScenePart;

/** Exposes the protected part-existence helpers so they can be asserted directly. */
class ProbeDriver extends ComponentDriver<typeof parts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, { ...option, parts });
  }

  missingPartNames(partName: keyof typeof parts | ReadonlyArray<keyof typeof parts>) {
    return this.getMissingPartNames(partName);
  }

  get driverName(): string {
    return 'ProbeDriver';
  }
}

/**
 * An interactor whose `exists()` resolves on a per-part delay, so probe COMPLETION
 * order is the reverse of the order the parts were asked about. Any implementation
 * that collects results as they settle produces a differently-ordered answer here.
 */
function createStaggeredInteractor(existingTestIds: ReadonlyArray<string>, delays: Record<string, number>): Interactor {
  const exists = jest.fn((locator: PartLocator) => {
    const selector = locator.at(-1)!.selector;
    const testId = /\[data-testid="(.+)"\]/.exec(selector)![1];
    return new Promise<boolean>(resolve => {
      setTimeout(() => resolve(existingTestIds.includes(testId)), delays[testId] ?? 0);
    });
  });
  return { exists } as unknown as Interactor;
}

describe('ComponentDriver.commutableOption', () => {
  it('carries no `parts`, so a parent never hands its own parts to a child', () => {
    const driver = new ProbeDriver(byDataTestId('root'), {} as Interactor);

    expect(Object.keys(driver.commutableOption)).not.toContain('parts');
  });

  it("passes a caller's pass-through option down to every declared part", () => {
    const driver = new ProbeDriver(
      byDataTestId('root'),
      {} as Interactor,
      {
        theme: 'dark',
      } as Partial<IComponentDriverOption>
    );

    expect(driver.commutableOption).toEqual({ theme: 'dark' });
    expect(driver.parts.first.commutableOption).toEqual({ theme: 'dark' });
  });
});

describe('ComponentDriver.getMissingPartNames', () => {
  it('returns the missing names in the order asked for, not in probe-completion order', async () => {
    // `first` settles last, `third` first — a completion-ordered implementation
    // would answer ['third', 'first'].
    const interactor = createStaggeredInteractor(['second'], { first: 30, second: 0, third: 1 });
    const driver = new ProbeDriver(byDataTestId('root'), interactor);

    expect(await driver.missingPartNames(['first', 'second', 'third'])).toEqual(['first', 'third']);
  });

  it('keeps that order stable across repeated runs of the same failure', async () => {
    const interactor = createStaggeredInteractor([], { first: 20, second: 5, third: 0 });
    const driver = new ProbeDriver(byDataTestId('root'), interactor);

    const runs = await Promise.all([
      driver.missingPartNames(['first', 'second', 'third']),
      driver.missingPartNames(['first', 'second', 'third']),
    ]);

    expect(runs[0]).toEqual(['first', 'second', 'third']);
    expect(runs[1]).toEqual(['first', 'second', 'third']);
  });

  it('accepts a single part name', async () => {
    const interactor = createStaggeredInteractor(['first'], {});
    const driver = new ProbeDriver(byDataTestId('root'), interactor);

    expect(await driver.missingPartNames('first')).toEqual([]);
    expect(await driver.missingPartNames('second')).toEqual(['second']);
  });
});
