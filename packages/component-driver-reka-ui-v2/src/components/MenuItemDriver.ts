import { ComponentDriver, Optional } from '@atomic-testing/core';

/**
 * Driver for a single labelled, potentially-disabled list item shared by the
 * Reka menu-like primitives: `DropdownMenuItem` (`role="menuitem"`) and
 * `SelectItem` (`role="option"`) both render as a leaf with visible text and,
 * when disabled, both `data-disabled` (presence-only) and `aria-disabled="true"`
 * — verified against rendered `reka-ui@2.10.1` `DropdownMenuItem` DOM (byte-for-byte
 * match with `component-driver-radix-v1`'s `MenuItemDriver` contract). One item
 * driver serves both consumers, mirroring the radix-v1 precedent.
 *
 * @internal
 */
export class MenuItemDriver extends ComponentDriver<{}> {
  /** The item's visible label (trimmed text content), or `undefined` when empty. */
  async getLabel(): Promise<Optional<string>> {
    return (await this.getText())?.trim() ?? undefined;
  }

  /** Whether the item is disabled — Reka marks this with `aria-disabled="true"`. */
  async isDisabled(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-disabled')) === 'true';
  }

  override get driverName(): string {
    return 'RekaUiV2MenuItemDriver';
  }
}
