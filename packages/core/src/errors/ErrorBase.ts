import { ComponentDriver } from '../drivers';

/**
 * Base class for errors that include a reference to the component driver
 * where the error occurred. The `any` type for the driver's ScenePart
 * parameter is intentional to allow subclasses to narrow the driver type
 * (e.g., MissingPartError has driver: ComponentDriver).
 */
export class ErrorBase extends Error {
  constructor(
    message: string,

    public readonly driver: ComponentDriver<any>
  ) {
    super(message);
  }
}
