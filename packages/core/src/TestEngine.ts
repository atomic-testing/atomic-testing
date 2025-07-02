import { ComponentDriver } from './drivers/ComponentDriver';
import { Interactor } from './interactor/Interactor';
import { PartLocator } from './locators/PartLocator';
import { IComponentDriverOption, ScenePart } from './partTypes';

/**
 * Root driver used for driving a complete scene in a test.
 * It inherits all functionality from {@link ComponentDriver} and
 * adds a clean up hook so that tests can reliably dispose of resources.
 */

export class TestEngine<T extends ScenePart> extends ComponentDriver<T> {
  private readonly _cleanUp: () => Promise<void>;

  /**
   * Construct a {@link TestEngine} instance.
   *
   * @param locator     Root locator for the scene.
   * @param interactor  Low level interactor used by drivers.
   * @param option      Optional driver configuration.
   * @param cleanUp     Hook executed when {@link TestEngine.cleanUp | cleanUp} is called.
   */
  constructor(
    locator: PartLocator,
    public readonly interactor: Interactor,
    option?: IComponentDriverOption<T>,
    cleanUp?: () => Promise<void>
  ) {
    super(locator, interactor, option);
    this._cleanUp = cleanUp ?? (() => Promise.resolve());
  }

  /**
   * Run the clean up hook that was provided during construction.
   */
  async cleanUp(): Promise<void> {
    await this._cleanUp();
  }

  /**
   * Identifier for this driver. Used mainly by the debugging utilities.
   */
  get driverName(): string {
    return 'TestEngine';
  }
}
