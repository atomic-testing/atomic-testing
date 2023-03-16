import { defaultStep } from './defaultValues';
import { MissingPartError } from './errors/MissingPartError';
import {
  IComponentDriver,
  IComponentDriverOption,
  IInteractor,
  LocatorChain,
  Optional,
  PartName,
  ScenePart,
  ScenePartDriver,
  StepFunction,
} from './types';

export abstract class ComponentDriver<T extends ScenePart = {}> implements IComponentDriver<T> {
  private _locator: LocatorChain;
  private readonly _perform: StepFunction;
  private readonly _parts: ScenePartDriver<T>;

  constructor(
    locator: LocatorChain,
    public readonly interactor: IInteractor,
    option?: Partial<IComponentDriverOption<T>>,
  ) {
    this._locator = locator;
    this._perform = option?.perform ?? defaultStep;
    this._parts = getPartFromDefinition<T>(option?.parts ?? ({} as T), this._locator, interactor, option ?? {});
  }

  get parts(): ScenePartDriver<T> {
    return this._parts;
  }

  get locator(): LocatorChain {
    return this._locator;
  }

  get perform(): StepFunction {
    return this._perform;
  }

  async enforcePartExistence(partName: PartName<T> | ReadonlyArray<PartName<T>>): Promise<void> {
    const missingPartNames = await this.getMissingPartNames(partName);
    if (missingPartNames.length > 0) {
      // @ts-ignore
      throw new MissingPartError(missingPartNames);
    }
  }

  async getMissingPartNames(partName: PartName<T> | ReadonlyArray<PartName<T>>): Promise<readonly PartName<T>[]> {
    let partNames: ReadonlyArray<keyof T>;
    if (partName == null) {
      partNames = Object.keys(this._parts) as ReadonlyArray<keyof T>;
    } else {
      partNames = Array.isArray(partName) ? partName : [partName];
    }

    const missingParts: PartName<T>[] = [];
    const promises = partNames.map((x) => {
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

  getText(): Promise<Optional<string>> {
    return this.interactor.getText(this.locator);
  }

  exists(): Promise<boolean> {
    return this.interactor.exists(this.locator);
  }

  abstract get driverName(): string;
}

export function getPartFromDefinition<T extends ScenePart>(
  partDefinition: T,
  parentLocator: LocatorChain,
  interactor: IInteractor,
  option: Partial<IComponentDriverOption<T>>,
): ScenePartDriver<T> {
  const result: Partial<ScenePartDriver<T>> = {};

  for (const [nestedComponentName, scenePart2] of Object.entries(partDefinition)) {
    const { locator = nestedComponentName as string, driver, option: optionOverride } = scenePart2;

    const componentOption: IComponentDriverOption = {
      perform: optionOverride?.perform ?? option.perform ?? defaultStep,
    };

    const componentLocator = parentLocator.concat(locator);

    // @ts-ignore
    result[nestedComponentName] = new driver(componentLocator, interactor, componentOption);
  }

  return result as ScenePartDriver<T>;
}
