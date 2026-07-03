import { ComponentDriver, Optional } from '@atomic-testing/core';

/**
 * Driver for a single labelled, potentially-disabled list item shared by the
 * Radix menu-like primitives: `DropdownMenu.Item` (`role="menuitem"`) and
 * `Select.Item` (`role="option"`) both render as a leaf with visible text and,
 * when disabled, both `data-disabled` (presence-only) and `aria-disabled="true"`
 * — so one item driver serves both, mirroring `component-driver-mui-v7`'s reuse
 * of a single `MenuItemDriver` for its `MenuDriver` and `SelectDriver`.
 *
 * @internal
 */
export class MenuItemDriver extends ComponentDriver<{}> {
  /** The item's visible label (trimmed text content), or `undefined` when empty. */
  async getLabel(): Promise<Optional<string>> {
    return (await this.getText())?.trim() ?? undefined;
  }

  /** Whether the item is disabled — Radix marks this with `aria-disabled="true"`. */
  async isDisabled(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-disabled')) === 'true';
  }

  override get driverName(): string {
    return 'RadixV1MenuItemDriver';
  }
}
