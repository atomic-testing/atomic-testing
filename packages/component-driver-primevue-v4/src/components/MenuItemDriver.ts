import { byCssSelector, ComponentDriver, locatorUtil, Optional } from '@atomic-testing/core';
import type { ClickOption } from '@atomic-testing/core';

/**
 * Driver for a single labelled, potentially-disabled list item shared by the
 * PrimeVue list-surface drivers: `Select`'s options (`role="option"`) and
 * `Menu`'s items (`role="menuitem"`) both render an `<li>` with visible label
 * text, `aria-label`, and `aria-disabled="true"` when disabled — so one item
 * driver serves both, mirroring the same reuse in the MUI and Radix packages.
 *
 * DOM audit (primevue@4.5.5): a Select option handles clicks on the `<li>`
 * itself, but a Menu item's activation handler lives on the inner
 * `data-pc-section="itemlink"` anchor — a click dispatched on the `<li>` never
 * reaches a listener on a descendant, so {@link click} lands on the item link
 * when one exists and falls back to the item root otherwise.
 *
 * @internal
 */
export class MenuItemDriver extends ComponentDriver<{}> {
  /** The item's visible label (trimmed text content), or `undefined` when empty. */
  async getLabel(): Promise<Optional<string>> {
    return (await this.getText())?.trim() ?? undefined;
  }

  /** Whether the item is disabled — PrimeVue marks this with `aria-disabled="true"`. */
  async isDisabled(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-disabled')) === 'true';
  }

  override async click(option?: Partial<ClickOption>): Promise<void> {
    const itemLink = locatorUtil.append(this.locator, byCssSelector('[data-pc-section="itemlink"]'));
    if (await this.interactor.exists(itemLink)) {
      return this.interactor.click(itemLink, option);
    }
    return super.click(option);
  }

  override get driverName(): string {
    return 'PrimeVueV4MenuItemDriver';
  }
}
