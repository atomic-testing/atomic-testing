import { byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

/**
 * Driver for the Fluent v9 `InfoButton` component.
 *
 * DOM audit (@fluentui/react-components@9.74.3): the locator lands on a real
 * native `<button class="fui-InfoButton" aria-expanded>`. Unlike every other
 * Popover-backed overlay in this package (Wave 2's Dialog/Popover/Menu/etc.,
 * all portalled to `document.body`), `InfoButton`'s `inline` prop **defaults
 * to `true`**, so its `PopoverSurface` (`class="... fui-InfoButton__info"`)
 * renders as a plain DOM SIBLING immediately after the trigger button — no
 * portal re-root needed. This driver targets only that default `inline`
 * case; `inline={false}` switches to the standard portal-to-body behavior,
 * which this driver does not resolve (out of scope for this wave, same
 * asymmetry `OverlayDrawerDriver`/`InlineDrawerDriver` are split into two
 * classes over elsewhere in this package — see the README's Known gaps).
 *
 * The surface only exists while open (Fluent unmounts it on close, same as
 * `PopoverDriver`), so {@link getInfoText} naturally returns `undefined`
 * when closed.
 */
export class InfoButtonDriver extends ComponentDriver<{}> {
  /**
   * Locator for the inline popover surface — the immediate next sibling of
   * this button, matched via the adjacent-sibling combinator rather than a
   * bare class (which would collide with another `InfoButton`'s surface
   * elsewhere on the page).
   */
  private get infoLocator(): PartLocator {
    const chain = this.locator;
    const selfSelector = chain[chain.length - 1].selector;
    return locatorUtil.append(chain.slice(0, -1), byCssSelector(`${selfSelector} + .fui-InfoButton__info`));
  }

  /** Whether the info popover is open, read from the button's own `aria-expanded`. */
  async isOpen(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-expanded')) === 'true';
  }

  /** Open the info popover by clicking the button. No-ops if already open. */
  async open(): Promise<void> {
    if (!(await this.isOpen())) {
      await this.click();
    }
  }

  /** Close the info popover by clicking the button. No-ops if already closed. */
  async close(): Promise<void> {
    if (await this.isOpen()) {
      await this.click();
    }
  }

  /** The popover's info text, or `undefined` while closed (the surface unmounts on close). */
  async getInfoText(): Promise<Optional<string>> {
    return this.interactor.getText(this.infoLocator);
  }

  get driverName(): string {
    return 'FluentV9InfoButtonDriver';
  }
}
