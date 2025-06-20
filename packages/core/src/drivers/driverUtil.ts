import { Interactor } from '../interactor';
import { PartLocator } from '../locators/PartLocator';
import {
  IComponentDriverOption,
  ScenePart,
  ScenePartDriver,
  ScenePartDefinition,
} from '../partTypes';
import * as locatorUtil from '../utils/locatorUtil';
import { ComponentDriver } from './ComponentDriver';

export function getPartFromDefinition<T extends ScenePart>(
  partDefinition: T,
  parentLocator: PartLocator,
  interactor: Interactor,
  option: Partial<IComponentDriverOption<T>>
): ScenePartDriver<T> {
  const result: Partial<ScenePartDriver<T>> = {};

  const entries = Object.entries(partDefinition) as [keyof T, ScenePartDefinition][];

  for (const [nestedComponentName, scenePart2] of entries) {
    const { locator, driver, option: optionOverride } = scenePart2;

    const componentOption: Partial<IComponentDriverOption<ScenePart>> = {
      ...option,
      ...(optionOverride as Partial<IComponentDriverOption<ScenePart>>),
      parts: undefined,
    };

    const locatorContext: PartLocator = driver.prototype.overriddenParentLocator() ?? parentLocator;
    const actualLocator: PartLocator =
      driver.prototype.overrideLocatorRelativePosition() != null
        ? locatorUtil.overrideLocatorRelativePosition(locator, driver.prototype.overrideLocatorRelativePosition()!)
        : locator;

    const componentLocator = locatorUtil.append(locatorContext, actualLocator);

    const DriverCtor = driver as new (
      locator: PartLocator,
      interactor: Interactor,
      option?: Partial<IComponentDriverOption<ScenePart>>
    ) => ComponentDriver<ScenePart>;

    result[nestedComponentName] =
      (new DriverCtor(componentLocator, interactor, componentOption) as unknown as ScenePartDriver<T>[typeof nestedComponentName]);
  }

  return result as ScenePartDriver<T>;
}
