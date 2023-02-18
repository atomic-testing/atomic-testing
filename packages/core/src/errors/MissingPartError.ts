import { ScenePart } from '../types';

export const MissingPartErrorId = 'MissingPartError';

export class MissingPartError<T extends ScenePart> extends Error {
  constructor(public readonly missingPartName: keyof T | ReadonlyArray<keyof T>) {
    const partNames = Array.isArray(missingPartName) ? missingPartName : [missingPartName];
    const partNameString = partNames.map((name) => `${name}`).join(', ');
    super(`The part "${partNameString}" is missing`);
    this.name = MissingPartErrorId;
  }
}
