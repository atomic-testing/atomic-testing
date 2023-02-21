import { ComponentDriver } from './ComponentDriver';
import { PartSelectorType } from './selectors/PartSelectorType';

export type StepFunction = (work: () => Promise<void>) => Promise<void>;

export type PartName<T extends ScenePart> = keyof T;

/**
 * Part name to driver definition map
 */

// export type ScenePart<T extends PartDriverLookup> = {
export interface ScenePart {
  [partName: string]: {
    /**
     * Query which is used to locate the element
     */
    selector?: PartSelectorType;

    /**
     * The class of driver which is used to interact with the element
     */
    //driver: T[partName];
    driver: typeof ComponentDriver<any>;

    /**
     * Option for the driver
     */
    option?: Partial<IComponentDriverOption>;
  };
}

// export interface ScenePartDriver<T extends ScenePart> {
//   [partName: string]: typeof ComponentDriver;
// }

export type ScenePartDriver<T extends ScenePart> = {
  [gearName in keyof T]: InstanceType<T[gearName]['driver']> | null;
};

export interface ITestEngine<T extends ScenePart = {}> {
  updateBinding(): void;
  getParentEngine(): ITestEngine | null;
  getParts(): ScenePartDriver<T>;
  enforcePartExistence(partName: PartName<T> | ReadonlyArray<PartName<T>>): void;
  getMissingPartNames(partName?: PartName<T> | ReadonlyArray<PartName<T>>): ReadonlyArray<PartName<T>>;
}

export interface ITestEngineOption {
  step: StepFunction;
  onFinishUpdate?: () => Promise<void>;
}

export interface IComponentDriverOption {
  step: StepFunction;
  engine: ITestEngine<any>;
  onFinishUpdate?: () => Promise<void>;
}
