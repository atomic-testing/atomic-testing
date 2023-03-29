import { Optional } from './dataTypes';
import { ComponentDriver } from './drivers/ComponentDriver';
import { ContainerDriver } from './drivers/ContainerDriver';
import { LocatorChain } from './locators/LocatorChain';
import { PartLocatorType } from './locators/PartLocatorType';

export type PartName<T extends ScenePart> = keyof T;

export interface ComponentPartDefinition<T extends ScenePart> {
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
  option?: Partial<IComponentDriverOption<T>>;
}

export interface ContainerPartDefinition<ContentT extends ScenePart, T extends ScenePart> {
  /**
   * The locator of the part
   */
  locator?: PartLocatorType;

  /**
   * The class of driver which is used to interact with the element
   */
  driver: typeof ContainerDriver<ContentT, T>;

  /**
   * Option for the driver
   */
  option: Partial<IContainerDriverOption<ContentT, T>>;
}

export type ScenePartDefinition = ComponentPartDefinition<any> | ContainerPartDefinition<any, any>;

/**
 * Part name to driver definition map
 */
export interface ScenePart extends Record<string, ScenePartDefinition> {}

export type ScenePartDriver<T extends ScenePart> = {
  [partName in keyof T]: InstanceType<T[partName]['driver']>;
};

export interface IComponentDriverOption<T extends ScenePart = {}> {
  parts: T;
}

export interface IContainerDriverOption<ContentT extends ScenePart = {}, T extends ScenePart = {}>
  extends IComponentDriverOption<T> {
  content: ContentT;
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
