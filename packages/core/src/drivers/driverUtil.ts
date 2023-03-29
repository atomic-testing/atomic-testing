import { locatorUtil, PartLocatorType } from '..';
import { Interactor } from '../interactor';
import { LocatorChain } from '../locators';
import { IComponentDriverOption, ScenePart, ScenePartDriver } from '../partTypes';

export function getPartFromDefinition<T extends ScenePart>(
  partDefinition: T,
  parentLocator: LocatorChain,
  interactor: Interactor,
  option: Partial<IComponentDriverOption<T>>,
): ScenePartDriver<T> {
  const result: Partial<ScenePartDriver<T>> = {};

  for (const [nestedComponentName, scenePart2] of Object.entries(partDefinition)) {
    const { locator = nestedComponentName as string, driver, option: optionOverride } = scenePart2;

    const componentOption: Partial<IComponentDriverOption> = {
      ...option,
      ...optionOverride,
      parts: undefined,
    };

    const locatorContext: LocatorChain = driver.prototype.overriddenParentLocator() ?? parentLocator;
    const actualLocator: PartLocatorType =
      driver.prototype.overrideLocatorRelativePosition() != null
        ? locatorUtil.overrideLocatorRelativePosition(locator, driver.prototype.overrideLocatorRelativePosition()!)
        : locator;

    const componentLocator = locatorUtil.append(locatorContext, actualLocator);

    // @ts-ignore
    result[nestedComponentName] = new driver(componentLocator, interactor, componentOption);
  }

  return result as ScenePartDriver<T>;
}
