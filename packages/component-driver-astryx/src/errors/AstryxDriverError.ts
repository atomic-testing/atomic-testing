import { ComponentDriver, ErrorBase } from '@atomic-testing/core';

export const AstryxDriverErrorId = 'AstryxDriverError';

/**
 * Base error for Astryx component drivers.
 *
 * Mirrors the `errors/` module shape of the MUI driver packages (which subclass
 * core's {@link ErrorBase} with a stable `name` id) and is the parent that
 * future typed Astryx driver errors extend — e.g. an overlay driver throwing
 * when its portalled content is absent. The trivial `ButtonDriver` has no error
 * path of its own yet, so this exists as the package's error foundation rather
 * than for a current thrower.
 */
export class AstryxDriverError extends ErrorBase {
  constructor(message: string, driver: ComponentDriver<any>) {
    super(message, driver);
    this.name = AstryxDriverErrorId;
  }
}
