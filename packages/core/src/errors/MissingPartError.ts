import { ScenePart } from '../partTypes';
import { ErrorBase } from './ErrorBase';

export const MissingPartErrorId = 'MissingPartError';

/**
 * Thrown when one or more of a driver's declared `ScenePart` parts are not
 * found to exist — e.g. `enforcePartExistence` guards a method that requires
 * an optional part to be present before acting on it. Existence means presence
 * in the DOM, regardless of visibility.
 *
 * Carries the offending {@link missingPartName} (a single part name or, for a
 * multi-part check, the array of every name that was missing) alongside the
 * ADR-010 serializable `driverName` snapshot inherited from {@link ErrorBase}.
 */
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
