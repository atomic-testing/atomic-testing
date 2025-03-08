import { Interactor } from '../interactor';
import { PartLocator } from '../locators/PartLocator';
import { IComponentDriverOption, ScenePart, ScenePartDriver } from '../partTypes';
import * as locatorUtil from '../utils/locatorUtil';

export function getPartFromDefinition<T extends ScenePart>(
  partDefinition: T,
  parentLocator: PartLocator,
  interactor: Interactor,
  option: Partial<IComponentDriverOption<T>>,
): ScenePartDriver<T> {
  const result: Partial<ScenePartDriver<T>> = {};

  for (const [nestedComponentName, scenePart2] of Object.entries(partDefinition)) {
    const { locator, driver, option: optionOverride } = scenePart2;

    const componentOption: Partial<IComponentDriverOption> = {
      ...option,
      ...optionOverride,
      parts: undefined,
    };

    const locatorContext: PartLocator = driver.prototype.overriddenParentLocator() ?? parentLocator;
    const actualLocator: PartLocator =
      driver.prototype.overrideLocatorRelativePosition() != null
        ? // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          locatorUtil.overrideLocatorRelativePosition(locator, driver.prototype.overrideLocatorRelativePosition()!)
        : locator;

    const componentLocator = locatorUtil.append(locatorContext, actualLocator);

    // @ts-ignore
    result[nestedComponentName] = new driver(componentLocator, interactor, componentOption);
  }

  return result as ScenePartDriver<T>;
}
