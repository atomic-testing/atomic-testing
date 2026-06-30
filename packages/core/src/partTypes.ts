import { Optional } from './dataTypes';
import { ComponentDriver } from './drivers/ComponentDriver';
import { ContainerDriver } from './drivers/ContainerDriver';
import { ListComponentDriver, ListComponentDriverSpecificOption } from './drivers/ListComponentDriver';
import { WaitForOption } from './drivers/WaitForOption';
import { Interactor } from './interactor';
import type { LocatorRelativePosition } from './locators/LocatorRelativePosition';
import { PartLocator } from './locators/PartLocator';

export type PartName<T extends ScenePart> = keyof T;

/**
 * Constructor type for a {@link ComponentDriver}, exported publicly so packages
 * can reference it without importing from internal paths. It carries both the
 * construct signature and the static portal hooks every driver class inherits, so
 * concrete driver classes structurally match it.
 *
 * The `any` in the constraint `T extends ComponentDriver<any>` is load-bearing:
 * it lets the type accept any concrete driver regardless of its ScenePart type
 * parameter. The option position, by contrast, is honestly typed to
 * {@link ScenePart} — every driver's parts ultimately satisfy that constraint.
 */
export type ComponentDriverCtor<T extends ComponentDriver<any>> = {
  new (locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption<ScenePart>>): T;
  overriddenParentLocator(): Optional<PartLocator>;
  overrideLocatorRelativePosition(): Optional<LocatorRelativePosition>;
};

export interface ComponentPartDefinition<T extends ScenePart> {
  /**
   * The locator of the part
   */
  locator: PartLocator;

  /**
   * The class of driver which is used to interact with the element
   */
  driver: {
    new (locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption<T>>): ComponentDriver<T>;
  };

  option?: Partial<IComponentDriverOption<T>>;
}

export interface ContainerPartDefinition<ContentT extends ScenePart, T extends ScenePart> {
  /**
   * The locator of the part
   */
  locator: PartLocator;

  /**
   * The class of driver which is used to interact with the element
   */
  driver:
    | typeof ContainerDriver<ContentT, T>
    | (new (
        locator: PartLocator,
        interactor: Interactor,
        option?: Partial<IContainerDriverOption<ContentT, T>>
      ) => ContainerDriver<ContentT, T>);

  /**
   * Option for the driver. Optional, mirroring {@link ComponentPartDefinition.option};
   * a container with no extra content/parts can omit it.
   */
  option?: Partial<IContainerDriverOption<ContentT, T>>;
}

/**
 * Definition for a list component part. The `any` in `ItemT extends ComponentDriver<any>`
 * is necessary because ItemT represents the item driver type, and we need to accept
 * any item driver regardless of its ScenePart type parameter.
 */

export interface ListComponentPartDefinition<ItemT extends ComponentDriver<any>> {
  /**
   * The locator of the part
   */
  locator: PartLocator;

  /**
   * The class of driver which is used to interact with the element
   */
  driver:
    | typeof ListComponentDriver<ItemT>
    | (new (
        locator: PartLocator,
        interactor: Interactor,

        option: ListComponentDriverSpecificOption<ItemT> & Partial<IComponentDriverOption<ScenePart>>
      ) => ListComponentDriver<ItemT>);

  /**
   * Option for the driver
   */

  option: ListComponentDriverSpecificOption<ItemT> & Partial<IComponentDriverOption<ScenePart>>;
}

export type ScenePartDefinition =
  | ComponentPartDefinition<ScenePart>
  | ContainerPartDefinition<ScenePart, ScenePart>
  | ListComponentPartDefinition<ComponentDriver<ScenePart>>;

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

export interface IContainerDriverOption<
  ContentT extends ScenePart = {},
  T extends ScenePart = {},
> extends IComponentDriverOption<T> {
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
  readonly locator: PartLocator;

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
   * check whether the component is within the viewport.
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
  waitUntilComponentState(option?: Partial<Readonly<WaitForOption>>): Promise<void>;
}

export interface ITestEngine<T extends ScenePart = {}> extends IComponentDriver<T> {
  cleanUp(): Promise<void>;
}
