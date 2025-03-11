import { ComponentDriver } from '../drivers/ComponentDriver';
import { ScenePart } from '../partTypes';

import { ErrorBase } from './ErrorBase';

export const MissingPartErrorId = 'MissingPartError';

export class MissingPartError<T extends ScenePart> extends ErrorBase {
  constructor(
    public readonly missingPartName: keyof T | ReadonlyArray<keyof T>,
    public readonly driver: ComponentDriver<T>
  ) {
    const partNames = Array.isArray(missingPartName) ? missingPartName : [missingPartName];
    const partNameString = partNames.map(name => `${name}`).join(', ');
    super(`The part "${partNameString}" is missing`, driver);
    this.name = MissingPartErrorId;
  }
}
