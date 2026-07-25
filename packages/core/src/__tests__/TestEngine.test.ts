import { ComponentDriver } from '../drivers/ComponentDriver';
import { Interactor } from '../interactor/Interactor';
import { byDataTestId } from '../locators/byDataTestId';
import { ScenePart } from '../partTypes';
import { TestEngine } from '../TestEngine';

class LeafDriver extends ComponentDriver {
  get driverName(): string {
    return 'LeafDriver';
  }
}

const parts = {
  input: { locator: byDataTestId('input'), driver: LeafDriver },
} satisfies ScenePart;

const stubInteractor = {} as Interactor;

describe('TestEngine', () => {
  it('exposes the interactor it was constructed with', () => {
    const engine = new TestEngine(byDataTestId('root'), stubInteractor, { parts });

    // Inherited from ComponentDriver rather than re-declared here — a duplicate
    // parameter property would re-assign the same value after `super()` returns,
    // which is exactly the kind of shadowing `useDefineForClassFields` makes
    // fragile.
    expect(engine.interactor).toBe(stubInteractor);
    expect(engine.parts.input.interactor).toBe(stubInteractor);
  });

  it('builds its parts from the scene it was given', () => {
    const engine = new TestEngine(byDataTestId('root'), stubInteractor, { parts });

    expect(engine.parts.input.locator.map(loc => loc.selector)).toEqual([
      '[data-testid="root"]',
      '[data-testid="input"]',
    ]);
  });

  it('runs the clean up hook exactly once per call', async () => {
    const cleanUp = jest.fn().mockResolvedValue(undefined);
    const engine = new TestEngine(byDataTestId('root'), stubInteractor, { parts }, cleanUp);

    await engine.cleanUp();

    expect(cleanUp).toHaveBeenCalledTimes(1);
  });

  it('resolves cleanUp when no hook was supplied', async () => {
    const engine = new TestEngine(byDataTestId('root'), stubInteractor, { parts });

    await expect(engine.cleanUp()).resolves.toBeUndefined();
  });
});
