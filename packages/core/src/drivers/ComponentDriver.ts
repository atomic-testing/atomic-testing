import { Optional } from '../dataTypes';
import { MissingPartError } from '../errors/MissingPartError';
import { Interactor } from '../interactor';
import { LocatorChain, LocatorRelativePosition } from '../locators';
import { IComponentDriver, IComponentDriverOption, PartName, ScenePart, ScenePartDriver } from '../partTypes';
import { getPartFromDefinition } from './driverUtil';

export abstract class ComponentDriver<T extends ScenePart = {}> implements IComponentDriver<T> {
  private _locator: LocatorChain;
  private readonly _parts: ScenePartDriver<T>;

  constructor(
    locator: LocatorChain,
    public readonly interactor: Interactor,
    option?: Partial<IComponentDriverOption<T>>,
  ) {
    this._locator = locator;
    this._parts = getPartFromDefinition<T>(option?.parts ?? ({} as T), this._locator, interactor, option ?? {});
  }

  /**
   * Usually this should be undefined as the component driver corresponds to a component nested inside the parent DOM, thus
   * the driver's locator would automatically chain with its parent's locator.
   *
   * When the component is rendered outside the parent's DOM, which usually happens when the component is a modal or popup,
   * supply the LocatorChain on how to locate the component with the component's own locator.
   *
   * Caution of usage: this function is called before the construction of the driver, so it should not use any instance properties
   */
  overriddenParentLocator(): Optional<LocatorChain> {
    return undefined;
  }

  /**
   * Usually this should be undefined when the locator is defined by the ScenePart, thus it reflects the natural relative position
   * of the component
   *
   * However, in some implementation such as MUI v5 dialog, the actual dialog DOM is rendered outside the parent DOM,
   * and the selector is "siblings", by defining this function, it allows the driver to have the knowledge of the actual relative position
   * instead of offloading the knowledge to the consumer.
   *
   * Caution of usage: this function is called before the construction of the driver, so it should not use any instance properties
   * @returns
   */
  overrideLocatorRelativePosition(): Optional<LocatorRelativePosition> {
    return undefined;
  }

  get parts(): ScenePartDriver<T> {
    return this._parts;
  }

  get locator(): LocatorChain {
    return this._locator;
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
