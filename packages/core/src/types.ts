import { ComponentDriver } from './drivers/ComponentDriver';
import { IClickOption } from './drivers/driverTypes';
import { PartLocatorType } from './locators/PartLocatorType';

export type StepFunction = (work: () => Promise<void>) => Promise<void>;
export type Optional<T> = T | undefined;
export type Nullable<T> = T | null;

export type PartName<T extends ScenePart> = keyof T;

export interface ScenePartDefinition<T extends ScenePart> {
  /**
   * The locator of the part
   */
  locator?: PartLocatorType;

  /**
   * The class of driver which is used to interact with the element
   */
  driver: typeof ComponentDriver<T>;

  /**
   * Option for the driver
   */
  option?: Partial<IComponentDriverOption>;
}

/**
 * Part name to driver definition map
 */
export interface ScenePart extends Record<string, ScenePartDefinition<any>> {}

export type ScenePartDriver<T extends ScenePart> = {
  [partName in keyof T]: InstanceType<T[partName]['driver']>;
};

export type LocatorChain = readonly PartLocatorType[];

export interface IEnterTextOption {
  /**
   * Append text to the target, default to false
   */
  append: boolean;
}

export interface IInteractor {
  //#region Potentially DOM mutative interactions
  /**
   * Click on the desired element
   * @param locator
   * @param option
   */
  click(locator: LocatorChain, option?: Partial<IClickOption>): Promise<void>;

  /**
   * Type text into the desired element
   * @param locator
   * @param value
   */
  enterText(locator: LocatorChain, text: string, option?: Partial<IEnterTextOption>): Promise<void>;

  /**
   * Select option by value from a select element
   * @param locator
   * @param values
   */
  selectOptionValue(locator: LocatorChain, values: string[]): Promise<void>;

  /**
   * Perform a mouse hover on the desired element
   * @param locator
   */
  hover(locator: LocatorChain): Promise<void>;
  //#endregion

  //#region Read only interactions
  getInputValue(locator: LocatorChain): Promise<Optional<string>>;
  getSelectValues(locator: LocatorChain): Promise<Optional<readonly string[]>>;

  getAttribute(locator: LocatorChain, name: string, isMultiple: true): Promise<readonly string[]>;
  getAttribute(locator: LocatorChain, name: string, isMultiple: false): Promise<Optional<string>>;
  getAttribute(locator: LocatorChain, name: string): Promise<Optional<string>>;

  getText(locator: LocatorChain): Promise<Optional<string>>;
  exists(locator: LocatorChain): Promise<boolean>;
  isChecked(locator: LocatorChain): Promise<boolean>;
  isDisabled(locator: LocatorChain): Promise<boolean>;
  isReadonly(locator: LocatorChain): Promise<boolean>;

  hasCssClass(locator: LocatorChain, className: string): Promise<boolean>;
  hasAttribute(locator: LocatorChain, name: string): Promise<boolean>;
  //#endregion

  clone(): IInteractor;
}

export interface IComponentDriverOption<T extends ScenePart = {}> {
  parts?: T;
}

export interface IComponentDriver<T extends ScenePart = {}> {
  readonly parts: ScenePartDriver<T>;

  /**
   * The locator which helps locate the root of the component
   */
  readonly locator: LocatorChain;

  enforcePartExistence(partName: PartName<T> | ReadonlyArray<PartName<T>>): Promise<void>;
  getMissingPartNames(partName?: PartName<T> | ReadonlyArray<PartName<T>>): Promise<ReadonlyArray<PartName<T>>>;

  getText(): Promise<Optional<string>>;
}

export interface ITestEngine<T extends ScenePart = {}> extends IComponentDriver<T> {
  cleanUp(): Promise<void>;
}
