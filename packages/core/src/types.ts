import { ComponentDriver } from './ComponentDriver';
import { IClickOption } from './driverTypes';
import { PartLocatorType } from './locators/PartLocatorType';

export type StepFunction = (work: () => Promise<void>) => Promise<void>;
export type Optional<T> = T | undefined;
export type Nullable<T> = T | null;

export type PartName<T extends ScenePart> = keyof T;

/**
 * Part name to driver definition map
 */
export interface ScenePart {
  [partName: string]: {
    /**
     * Query which is used to locate the element
     */
    locator?: PartLocatorType;

    /**
     * The class of driver which is used to interact with the element
     */
    driver: typeof ComponentDriver<any>;

    /**
     * Option for the driver
     */
    option?: Partial<IComponentDriverOption>;
  };
}

export type ScenePartDriver<T extends ScenePart> = {
  [partName in keyof T]: InstanceType<T[partName]['driver']>;
};

export type LocatorChain = readonly PartLocatorType[];

export interface IEnterTextOption {}

document.querySelector('input');

export interface IInteractor {
  click(locator: LocatorChain, option?: Partial<IClickOption>): Promise<void>;

  /**
   * Type text into the desired element
   * @param locator
   * @param value
   */
  enterText(locator: LocatorChain, text: string, option?: Partial<IEnterTextOption>): Promise<void>;

  /**
   *
   * @param locator Select option by value from a select element
   * @param values
   */
  selectOptionValue(locator: LocatorChain, values: string[]): Promise<void>;

  getInputValue(locator: LocatorChain): Promise<Optional<string>>;
  getSelectValues(locator: LocatorChain): Promise<Optional<readonly string[]>>;

  getAttribute(locator: LocatorChain, name: string, isMultiple: true): Promise<readonly string[]>;
  getAttribute(locator: LocatorChain, name: string, isMultiple: false): Promise<Optional<string>>;
  getAttribute(locator: LocatorChain, name: string): Promise<Optional<string>>;

  getText(locator: LocatorChain): Promise<Optional<string>>;
  exists(locator: LocatorChain): Promise<boolean>;
  isChecked(locator: LocatorChain): Promise<boolean>;

  clone(): IInteractor;
}

export interface IComponentDriverOption<T extends ScenePart = {}> {
  perform: StepFunction;
  parts?: T;
}

export interface IComponentDriver<T extends ScenePart = {}> {
  readonly parts: ScenePartDriver<T>;

  /**
   * The locator which helps locate the root of the component
   */
  readonly locator: LocatorChain;

  /**
   * Function wrapper which performs a step
   */
  readonly perform: StepFunction;

  enforcePartExistence(partName: PartName<T> | ReadonlyArray<PartName<T>>): Promise<void>;
  getMissingPartNames(partName?: PartName<T> | ReadonlyArray<PartName<T>>): Promise<ReadonlyArray<PartName<T>>>;
}

export interface ITestEngine<T extends ScenePart = {}> extends IComponentDriver<T> {
  cleanUp(): Promise<void>;
}
