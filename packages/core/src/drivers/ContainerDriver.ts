import { Interactor } from '../interactor';
import { PartLocator } from '../locators';
import { IComponentDriver, IContainerDriverOption, ScenePart, ScenePartDriver } from '../partTypes';
import { ComponentDriver } from './ComponentDriver';

/**
 * @deprecated Use {@link ComponentDriver.scope} instead. It resolves an
 * interior scene at call time, so a container needs none of what this base
 * imposes: the `ContentT` type parameter, the `content` option naming the same
 * scene a second time, or the laundering constructor every subclass repeats.
 *
 * Retained for at least one minor per ADR-006 §2; scheduled for removal in the
 * 2.0 window tracked by ADR-017. The `content` getter below is now a thin
 * memoized wrapper over `scope`, so both channels resolve identically.
 */
export abstract class ContainerDriver<ContentT extends ScenePart, T extends ScenePart = {}>
  extends ComponentDriver<T>
  implements IComponentDriver<T>
{
  private readonly _content: ScenePartDriver<ContentT>;

  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IContainerDriverOption<ContentT, T>>) {
    super(locator, interactor, option);
    this._content = this.scope(option?.content ?? ({} as ContentT));
  }

  /** @deprecated Use {@link ComponentDriver.scope} instead. */
  get content(): ScenePartDriver<ContentT> {
    return this._content;
  }
}
