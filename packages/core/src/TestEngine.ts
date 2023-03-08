import { IComponentDriverOption, IInteractor, LocatorChain } from '@atomic-testing/core';

import { ComponentDriver } from './ComponentDriver';
import { ScenePart } from './types';

export class TestEngine<T extends ScenePart> extends ComponentDriver<T> {
  private readonly _cleanUp: () => Promise<void>;

  constructor(
    locator: LocatorChain,
    public readonly interactor: IInteractor,
    option?: IComponentDriverOption<T>,
    cleanUp?: () => Promise<void>,
  ) {
    super(locator, interactor, option);
    this._cleanUp = cleanUp ?? (() => Promise.resolve());
  }

  async cleanUp(): Promise<void> {
    await this._cleanUp();
  }

  get driverName(): string {
    return 'TestEngine';
  }
}
