import { byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

/**
 * Driver for the Astryx MobileNav (`@astryxdesign/core/MobileNav`).
 *
 * MobileNav is an inline (not portalled) native `<dialog class="astryx-mobile-nav">`
 * drawer that forwards `data-testid` onto the `<dialog>`, names itself with
 * `aria-label`, and records its slide edge in `data-side`. It contains a header
 * `<h2>`, a `<button aria-label="Close navigation">`, and `SideNavItem` links.
 * Because the dialog is rendered in place, all of that structure is a normal
 * descendant and reads faithfully in jsdom.
 *
 * The OPEN state is set by `dialog.showModal()`, which is a **no-op in jsdom** — the
 * `open` attribute is never applied there — so {@link isOpen} reports `true` only
 * under the E2E (browser) run. Never assert the open state in the shared suite;
 * assert the closed-state structure (label, side, close button, items) instead.
 */
export class MobileNavDriver extends ComponentDriver<{}> {
  /** The drawer's close affordance (`<button aria-label="Close navigation">`). */
  private get closeButton(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('button[aria-label="Close navigation"]'));
  }

  /** The drawer's accessible name (`aria-label`). */
  async getLabel(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'aria-label');
  }

  /** The edge the drawer slides from, from `data-side` (`'start'` | `'end'`; `'auto'` resolves at runtime). */
  async getSide(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-side');
  }

  /** Whether a close button is rendered. */
  async hasCloseButton(): Promise<boolean> {
    return this.interactor.exists(this.closeButton);
  }

  /**
   * Whether the drawer is open — the native `<dialog>`'s `open` attribute.
   *
   * E2E-only for `true`: opening calls `showModal()`, a no-op in jsdom, so this
   * always reports `false` there regardless of the `isOpen` prop.
   */
  async isOpen(): Promise<boolean> {
    return this.interactor.hasAttribute(this.locator, 'open');
  }

  get driverName(): string {
    return 'AstryxMobileNavDriver';
  }
}
