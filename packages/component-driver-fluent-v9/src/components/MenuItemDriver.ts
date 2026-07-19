import { ComponentDriver, Optional } from '@atomic-testing/core';

/**
 * Driver for a plain Fluent v9 `MenuItem` (`role="menuitem"`, class
 * `fui-MenuItem`) — DOM audit, `@fluentui/react-components@9.74.3`. See
 * `MenuItemCheckboxDriver`/`MenuItemRadioDriver` for the toggleable variants.
 */
export class MenuItemDriver extends ComponentDriver<{}> {
  /** The item's visible label (trimmed text content), or `undefined` when empty. */
  async getLabel(): Promise<Optional<string>> {
    return (await this.getText())?.trim() ?? undefined;
  }

  /** Whether the item is disabled — Fluent marks this with `aria-disabled="true"`. */
  async isDisabled(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-disabled')) === 'true';
  }

  get driverName(): string {
    return 'FluentV9MenuItemDriver';
  }
}
