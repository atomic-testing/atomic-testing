import { ButtonDriver } from './ButtonDriver';

/**
 * Driver for the Astryx IconButton (`@astryxdesign/core/IconButton`).
 *
 * IconButton is a thin wrapper over Button that is always icon-only, so Astryx
 * always emits an explicit `aria-label` (the visible content is the icon). It
 * renders the same native `<button>` and forwards unknown props (`data-testid`),
 * so this driver inherits everything from {@link ButtonDriver} — `getLabel`
 * returns the always-present `aria-label`.
 */
export class IconButtonDriver extends ButtonDriver {
  override get driverName(): string {
    return 'AstryxIconButtonDriver';
  }
}
