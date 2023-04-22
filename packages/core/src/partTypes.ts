import { Optional } from './dataTypes';
import { ComponentDriver } from './drivers/ComponentDriver';
import { ContainerDriver } from './drivers/ContainerDriver';
import { WaitForOption } from './drivers/WaitForOption';
import { Interactor } from './interactor';
import { LocatorChain } from './locators/LocatorChain';
import { PartLocatorType } from './locators/PartLocatorType';

export type PartName<T extends ScenePart> = keyof T;

export type ComponentDriverClass<T extends ComponentDriver<P>, P extends ScenePart = {}> = new (
  locator: LocatorChain,
  interactor: Interactor,
  option?: Partial<IComponentDriverOption<P>>,
) => T;

export interface ComponentPartDefinition<T extends ScenePart> {
  /**
   * The locator of the part
   */
  locator?: PartLocatorType;

  /**
   * The class of driver which is used to interact with the element
   */
  driver: typeof ComponentDriver<T> | ComponentDriverClass<ComponentDriver<T>, T>;

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
  driver:
    | typeof ContainerDriver<ContentT, T>
    | (new (
        locator: LocatorChain,
        interactor: Interactor,
        option?: Partial<IContainerDriverOption<ContentT, T>>,
      ) => ContainerDriver<ContentT, T>);

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
  /**
   * Return driver instance of all the named parts
   */
  readonly parts: ScenePartDriver<T>;

  /**
   * The locator which helps locate the root of the component
   */
  readonly locator: LocatorChain;

  /**
   * Get the combined text content of the component
   * @returns If the component exists and has content, it should return the text or otherwise undefined
   */
  getText(): Promise<Optional<string>>;

  /**
   * Whether the component exists/attached to the DOM
   * @returns true if the component is attached to the DOM, false otherwise
   */
  exists(): Promise<boolean>;

  /**
   * Whether the component is visible.  Visibility is defined
   * that the component does not have the CSS property `display: none`,
   * `visibility: hidden`, or `opacity: 0`.  However this does not
   * check wether the component is within the viewport.
   *
   * @returns true if the component is visible, false otherwise
   */
  isVisible(): Promise<boolean>;

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
  waitUntil(option?: Partial<Readonly<WaitForOption>>): Promise<void>;
}

export interface ITestEngine<T extends ScenePart = {}> extends IComponentDriver<T> {
  cleanUp(): Promise<void>;
}
