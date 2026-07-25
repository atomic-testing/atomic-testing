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

/**
 * The container-specific slice of {@link IContainerDriverOption} — whatever it
 * adds on top of the base {@link IComponentDriverOption}. Derived from the two
 * interfaces rather than spelled out, so it cannot drift from them; the
 * constructor's strip-list is locked against it.
 */
type ContainerSpecificOption<ContentT extends ScenePart, T extends ScenePart> = Omit<
  IContainerDriverOption<ContentT, T>,
  keyof IComponentDriverOption<T>
>;

export abstract class ContainerDriver<ContentT extends ScenePart, T extends ScenePart = {}>
  extends ComponentDriver<T>
  implements IComponentDriver<T>
{
  private readonly _content: ScenePartDriver<ContentT>;

  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IContainerDriverOption<ContentT, T>>) {
    // `content` is this container's own configuration, not something its
    // descendants inherit — strip it before `super` so it never rides along in
    // `commutableOption` and hand a nested container the OUTER one's content
    // parts. Same obligation, same reason as ListComponentDriver's item config.
    const { content, ...commutable } = option ?? {};
    // Compile-time lock on the split above — see ListComponentDriver's.
    const containerOption: ContainerSpecificOption<ContentT, T> = { content: content ?? ({} as ContentT) };
    super(locator, interactor, commutable);
    // Content parts are children exactly like `parts`, so they are built from the
    // same shared slice; previously they got a freshly-created empty option and
    // silently inherited nothing the declared parts inherited.
    this._content = getPartFromDefinition(containerOption.content, this.locator, interactor, this.commutableOption);
  }

  get content(): ScenePartDriver<ContentT> {
    return this._content;
  }
}
