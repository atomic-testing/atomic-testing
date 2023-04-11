import { Optional } from '../dataTypes';
import { MissingPartError } from '../errors/MissingPartError';
import { WaitForFailureError } from '../errors/WaitForFailureError';
import { Interactor } from '../interactor';
import { LocatorChain, LocatorRelativePosition } from '../locators';
import { IComponentDriver, IComponentDriverOption, PartName, ScenePart, ScenePartDriver } from '../partTypes';
import * as timingUtil from '../utils/timingUtil';
import { getPartFromDefinition } from './driverUtil';
import { defaultWaitForOption, WaitForOption } from './WaitForOption';

export abstract class ComponentDriver<T extends ScenePart = {}> implements IComponentDriver<T> {
  private _locator: LocatorChain;
  private readonly _parts: ScenePartDriver<T>;

  constructor(
    locator: LocatorChain,
    public readonly interactor: Interactor,
    option?: Partial<IComponentDriverOption<T>>,
  ) {
    this._locator = locator;
    this._parts = getPartFromDefinition<T>(option?.parts ?? ({} as T), this._locator, interactor, option ?? {});
  }

  /**
   * Usually this should be undefined as the component driver corresponds to a component nested inside the parent DOM, thus
   * the driver's locator would automatically chain with its parent's locator.
   *
   * When the component is rendered outside the parent's DOM, which usually happens when the component is a modal or popup,
   * supply the LocatorChain on how to locate the component with the component's own locator.
   *
   * Caution of usage: this function is called before the construction of the driver, so it should not use any instance properties
   */
  overriddenParentLocator(): Optional<LocatorChain> {
    return undefined;
  }

  /**
   * Usually this should be undefined when the locator is defined by the ScenePart, thus it reflects the natural relative position
   * of the component
   *
   * However, in some implementation such as MUI v5 dialog, the actual dialog DOM is rendered outside the parent DOM,
   * and the selector is "siblings", by defining this function, it allows the driver to have the knowledge of the actual relative position
   * instead of offloading the knowledge to the consumer.
   *
   * Caution of usage: this function is called before the construction of the driver, so it should not use any instance properties
   * @returns
   */
  overrideLocatorRelativePosition(): Optional<LocatorRelativePosition> {
    return undefined;
  }

  /**
   * Return driver instance of all the named parts
   */
  get parts(): ScenePartDriver<T> {
    return this._parts;
  }

  /**
   * Return the locator of the component
   */
  get locator(): LocatorChain {
    return this._locator;
  }

  /**
   * Check the specified parts' existences, and throw MissPartError if any of the part is found not existence.
   * Existence is defined by the part's existence in the DOM regardless of its visibility on the screen
   * @param partName Single or array of the names of the parts to be enforced
   */
  protected async enforcePartExistence(partName: PartName<T> | ReadonlyArray<PartName<T>>): Promise<void> {
    const missingPartNames = await this.getMissingPartNames(partName);
    if (missingPartNames.length > 0) {
      // @ts-ignore
      throw new MissingPartError(missingPartNames);
    }
  }

  /**
   * Get the names of parts not in the DOM
   * @param partName Single or array of the names of the parts to be examined
   * @returns
   */
  protected async getMissingPartNames(
    partName: PartName<T> | ReadonlyArray<PartName<T>>,
  ): Promise<readonly PartName<T>[]> {
    let partNames: ReadonlyArray<keyof T>;
    if (partName == null) {
      partNames = Object.keys(this._parts) as ReadonlyArray<keyof T>;
    } else {
      partNames = Array.isArray(partName) ? partName : [partName];
    }

    const missingParts: PartName<T>[] = [];
    const promises = partNames.map((x) => {
      const fn = async () => {
        const partExists = await this.interactor.exists(this._parts[x]!.locator);
        if (!partExists) {
          missingParts.push(x);
        }
      };
      return fn();
    });

    await Promise.all(promises);
    return missingParts;
  }

  /**
   * Get the combined text content of the component
   * @returns If the component exists and has content, it should return the text or otherwise undefined
   */
  getText(): Promise<Optional<string>> {
    return this.interactor.getText(this.locator);
  }

  /**
   * Whether the component exists/attached to the DOM
   * @returns true if the component is attached to the DOM, false otherwise
   */
  exists(): Promise<boolean> {
    return this.interactor.exists(this.locator);
  }

  /**
   * Whether the component is visible.  Visibility is defined
   * that the component does not have the CSS property `display: none`,
   * `visibility: hidden`, or `opacity: 0`.  However this does not
   * check wether the component is within the viewport.
   *
   * @returns true if the component is visible, false otherwise
   */
  isVisible(): Promise<boolean> {
    return this.interactor.isVisible(this.locator);
  }

  /**
   * Wait until the component is in the expected state such as
   * the component's visibility or existence. If the component has
   * not reached the expected state within the timeout, it will throw
   * an error.
   *
   * By default it waits until the component is attached to the DOM
   * within 30 seconds.
   *
   * @param option The option to configure the wait behavior
   */
  async waitUntil(option: Partial<Readonly<WaitForOption>> = defaultWaitForOption): Promise<void> {
    const actualOption = { ...defaultWaitForOption, ...option };
    let probeFn: () => Promise<boolean>;
    let expected: boolean;
    switch (actualOption.condition) {
      case 'hidden':
        probeFn = () => this.interactor.isVisible(this.locator);
        expected = false;
        break;
      case 'detached':
        probeFn = () => this.interactor.exists(this.locator);
        expected = false;
        break;
      case 'visible':
        probeFn = () => this.interactor.isVisible(this.locator);
        expected = true;
        break;
      default: // 'attached'
        probeFn = () => this.interactor.exists(this.locator);
        expected = true;
        break;
    }

    const actual = await timingUtil.waitUntil(probeFn, expected, actualOption.timeoutMs);
    if (actual !== expected) {
      throw new WaitForFailureError(this.locator, actualOption);
    }
  }

  abstract get driverName(): string;
}
