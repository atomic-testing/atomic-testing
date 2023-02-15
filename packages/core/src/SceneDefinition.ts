import { ComponentDriver } from './ComponentDriver';
import { IComponentDriverOption } from './types';

export type PartQueryType = string;

/**
 * Part name to driver definition map
 */
export type PartDriverLookup = {
  [partName: string]: typeof ComponentDriver;
};

export type ScenePart<T extends PartDriverLookup> = {
  [partName in keyof T]: {
    /**
     * Query which is used to locate the element
     */
    query?: PartQueryType;

    /**
     * The class of driver which is used to interact with the element
     */
    driver: T[partName];

    /**
     * Option for the driver
     */
    option?: Partial<IComponentDriverOption>;
  };
};

export type PartDriverInstance<T extends PartDriverLookup> = {
  [gearName in keyof T]: InstanceType<T[gearName]>;
};

/**
 * Use in actual testing of definiting the engine
 */
export type TestEngineType<T extends ScenePart<P>, P extends PartDriverLookup> = {
  [partName in keyof T]: T[partName]['driver'];
};
