import { locatorUtil } from '..';

import { Optional } from '../dataTypes';
import { MissingPartError } from '../errors/MissingPartError';
import {
  ClickOption,
  FocusOption,
  HoverOption,
  Interactor,
  MouseDownOption,
  MouseEnterOption,
  MouseLeaveOption,
  MouseMoveOption,
  MouseOutOption,
  MouseUpOption,
} from '../interactor';
import { LocatorRelativePosition, PartLocator } from '../locators';
import { IComponentDriver, IComponentDriverOption, PartName, ScenePart, ScenePartDriver } from '../partTypes';
import { WaitUntilOption } from '../utils/timingUtil';

import { defaultWaitForOption, WaitForOption } from './WaitForOption';
import { getPartFromDefinition } from './driverUtil';

/**
 * Base class for all component drivers.  It provides the basic functionality to interact with the component
 */
export abstract class ComponentDriver<T extends ScenePart = {}> implements IComponentDriver<T> {
  private _locator: PartLocator;
  private readonly _parts: ScenePartDriver<T>;

  /**
   * Option passed to the constructor includes both universal options which can be shared across
   * all component driver tree, and component specific options which are only applicable to the component.
   *
   * Commutable option is the option that can be shared across all component driver tree.
   */
  public readonly commutableOption: IComponentDriverOption<T>;

  constructor(
    locator: PartLocator,
    public readonly interactor: Interactor,
    option?: Partial<IComponentDriverOption<T>>
  ) {
    this._locator = locator;
    this._parts = getPartFromDefinition<T>(option?.parts ?? ({} as T), this._locator, interactor, option ?? {});
    this.commutableOption = {
      ...option,
      parts: {} as T,
    };
  }

  /**
   * Usually this should be undefined as the component driver corresponds to a component nested inside the parent DOM, thus
   * the driver's locator would automatically chain with its parent's locator.
   *
   * When the component is rendered outside the parent's DOM, which usually happens when the component is a modal or popup,
   * supply the PartLocator on how to locate the component with the component's own locator.
   *
   * Caution of usage: this function is called before the construction of the driver, so it should not use any instance properties
   */
  overriddenParentLocator(): Optional<PartLocator> {
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
  get locator(): PartLocator {
    return this._locator;
  }

  /**
   * Check the specified parts' existences, and throw MissingPartError if any of the part is found not existence.
   * Existence is defined by the part's existence in the DOM regardless of its visibility on the screen
   * @param partName Single or array of the names of the parts to be enforced
   */
  protected async enforcePartExistence(partName: PartName<T> | ReadonlyArray<PartName<T>>): Promise<void> {
    const missingPartNames = await this.getMissingPartNames(partName);
    if (missingPartNames.length > 0) {
      throw new MissingPartError<T>(missingPartNames, this);
    }
  }

  /**
   * Get the names of parts not in the DOM
   * @param partName Single or array of the names of the parts to be examined
   * @returns
   */
  protected async getMissingPartNames(
    partName: PartName<T> | ReadonlyArray<PartName<T>>
  ): Promise<readonly PartName<T>[]> {
    let partNames: ReadonlyArray<keyof T>;
    if (partName == null) {
      partNames = Object.keys(this._parts) as ReadonlyArray<keyof T>;
    } else {
      partNames = Array.isArray(partName) ? partName : [partName];
    }

    const missingParts: PartName<T>[] = [];
    const promises = partNames.map(x => {
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

  getAttribute(attributeName: string): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, attributeName);
  }

  /**
   * Whether the component exists/attached to the DOM
   * @returns true if the component is attached to the DOM, false otherwise
   */
  exists(): Promise<boolean> {
    return this.interactor.exists(this.locator);
  }

  async click(option?: Partial<ClickOption>): Promise<void> {
    return this.interactor.click(this.locator, option);
  }

  async hover(option?: Partial<HoverOption>): Promise<void> {
    return this.interactor.hover(this.locator, option);
  }

  async mouseMove(option?: Partial<MouseMoveOption>): Promise<void> {
    return this.interactor.mouseMove(this.locator, option);
  }

  async mouseDown(option?: Partial<MouseDownOption>): Promise<void> {
    return this.interactor.mouseDown(this.locator, option);
  }

  async mouseUp(option?: Partial<MouseUpOption>): Promise<void> {
    return this.interactor.mouseUp(this.locator, option);
  }

  async mouseOver(option?: Partial<HoverOption>): Promise<void> {
    return this.interactor.mouseOver(this.locator, option);
  }

  async mouseOut(option?: Partial<MouseOutOption>): Promise<void> {
    return this.interactor.mouseOut(this.locator, option);
  }

  async mouseEnter(option?: Partial<MouseEnterOption>): Promise<void> {
    return this.interactor.mouseEnter(this.locator, option);
  }

  async mouseLeave(option?: Partial<MouseLeaveOption>): Promise<void> {
    return this.interactor.mouseLeave(this.locator, option);
  }

  async focus(option?: Partial<FocusOption>): Promise<void> {
    return this.interactor.focus(this.locator, option);
  }

  /**
   * Whether the component is visible.  Visibility is defined
   * that the component does not have the CSS property `display: none`,
  * `visibility: hidden`, or `opacity: 0`.  However this does not
  * check whether the component is within the viewport.
   *
   * @returns true if the component is visible, false otherwise
   */
  isVisible(): Promise<boolean> {
    return this.interactor.isVisible(this.locator);
  }

  /**
   * Wait until the component is attached and becomes visible to the DOM.
   * @param timeoutMs The number of milliseconds to wait before timing out
   */
  async waitUntilVisible(timeoutMs: number = 10000): Promise<void> {
    return this.waitUntilComponentState({
      condition: 'visible',
      timeoutMs,
    });
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
  async waitUntilComponentState(option: Partial<Readonly<WaitForOption>> = defaultWaitForOption): Promise<void> {
    return this.interactor.waitUntilComponentState(this.locator, option);
  }

  waitUntil<T>(option: WaitUntilOption<T>): Promise<T> {
    return this.interactor.waitUntil(option);
  }

  /**
   * Get the inner HTML of the component
   * @returns The inner HTML of the component
   */
  innerHTML(): Promise<string> {
    return this.interactor.innerHTML(this.locator);
  }

  /**
   * Get the runtime CSS selector of the component. This is useful for debugging and testing purposes.
   *
   * @returns The runtime CSS selector of the component
   */
  runtimeCssSelector(): Promise<string> {
    return locatorUtil.toCssSelector(this.locator, this.interactor);
  }

  abstract get driverName(): string;
}
