import { Interactor } from '../interactor';
import { PartLocator } from '../locators';
import {
  IComponentDriver,
  IContainerDriverOption,
  IComponentDriverOption,
  ScenePart,
  ScenePartDriver,
} from '../partTypes';

import { ComponentDriver } from './ComponentDriver';
import { getPartFromDefinition } from './driverUtil';

export abstract class ContainerDriver<ContentT extends ScenePart, T extends ScenePart = {}>
  extends ComponentDriver<T>
  implements IComponentDriver<T>
{
  private readonly _content: ScenePartDriver<ContentT>;

  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IContainerDriverOption<ContentT, T>>) {
    super(locator, interactor, option);
    const { content: _content } = option ?? {};
    const contentOption: Partial<IComponentDriverOption<ContentT>> = {};
    this._content = getPartFromDefinition(option?.content ?? ({} as ContentT), this.locator, interactor, contentOption);
  }

  get content(): ScenePartDriver<ContentT> {
    return this._content;
  }
}
