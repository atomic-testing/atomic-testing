import { ComponentDriver } from '@atomic-testing/core';

/**
 * Driver for the Astryx NavIcon (`@astryxdesign/core/NavIcon`).
 *
 * NavIcon is a display-only `<span class="astryx-navicon">` (with `data-testid`
 * forwarded) wrapping the supplied `icon` node; the icon child is `aria-hidden`
 * but the wrapper itself is not. There is no role or text semantics, so the
 * driver only exposes presence and the rendered icon markup via the inherited
 * {@link ComponentDriver.innerHTML}.
 */
export class NavIconDriver extends ComponentDriver<{}> {
  override get driverName(): string {
    return 'AstryxNavIconDriver';
  }
}
