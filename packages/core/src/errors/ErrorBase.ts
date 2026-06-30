/**
 * Base class for errors raised from a component driver.
 *
 * Carries only a **serializable** snapshot of where the error occurred —
 * `driverName` — rather than a live `ComponentDriver` reference. This keeps the
 * frozen, catchable error contract decoupled from the evolving driver type (and
 * free of the `any` a `ComponentDriver<any>` field would leak), and stops callers
 * reaching driver/DOM internals through a caught error. The constructor accepts
 * anything name-bearing (a driver satisfies `{ driverName: string }`) and stores
 * only the name. See ADR-010.
 */
export class ErrorBase extends Error {
  readonly driverName: string;

  constructor(message: string, driver: { driverName: string }) {
    super(message);
    this.driverName = driver.driverName;
  }
}
