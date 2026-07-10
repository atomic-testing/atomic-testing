import { Interactor } from '../interactor';
import { PartLocator } from '../locators/PartLocator';
import {
  ComponentDriverCtor,
  IComponentDriverOption,
  ScenePart,
  ScenePartDefinition,
  ScenePartDriver,
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

    // A single, honest cast: `ComponentDriverCtor` is the type partTypes documents
    // as unifying the construct signature AND the static portal hooks every driver
    // class inherits, so this one binding serves both the static reads below and
    // the `new` at the end — replacing the former three separate casts. The
    // `unknown` bridge is unavoidable because a ScenePart's declared `driver` field
    // is a bare construct signature that does not surface the inherited statics.
    const driverCtor = driver as unknown as ComponentDriverCtor<ComponentDriver<ScenePart>>;

    const componentOption: Partial<IComponentDriverOption<ScenePart>> = {
      ...option,
      ...(optionOverride as Partial<IComponentDriverOption<ScenePart>>),
      parts: undefined,
    };

    // Portal hooks are static class metadata read off the constructor, never
    // instance methods (they run before any instance exists).
    const relativePositionOverride = driverCtor.overrideLocatorRelativePosition();
    const locatorContext: PartLocator = driverCtor.overriddenParentLocator() ?? parentLocator;
    const actualLocator: PartLocator =
      relativePositionOverride != null
        ? locatorUtil.overrideLocatorRelativePosition(locator, relativePositionOverride)
        : locator;

    const componentLocator = locatorUtil.append(locatorContext, actualLocator);

    // The per-key instance type is not statically knowable inside this dynamic
    // loop (each key maps to a different concrete driver), so narrowing the
    // constructed base `ComponentDriver<ScenePart>` to the mapped element type is
    // the one irreducible cast here.
    result[nestedComponentName] = new driverCtor(
      componentLocator,
      interactor,
      componentOption
    ) as ScenePartDriver<T>[typeof nestedComponentName];
  }

  return result as ScenePartDriver<T>;
}
