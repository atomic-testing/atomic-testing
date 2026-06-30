import { ScenePart } from '../partTypes';
import { ErrorBase } from './ErrorBase';

export const MissingPartErrorId = 'MissingPartError';

export class MissingPartError<T extends ScenePart> extends ErrorBase {
  constructor(
    public readonly missingPartName: keyof T | ReadonlyArray<keyof T>,
    driver: { driverName: string }
  ) {
    const partNames = Array.isArray(missingPartName) ? missingPartName : [missingPartName];
    const partNameString = partNames.map(name => `${String(name)}`).join(', ');
    super(`The part "${partNameString}" is missing`, driver);
    this.name = MissingPartErrorId;
  }
}
