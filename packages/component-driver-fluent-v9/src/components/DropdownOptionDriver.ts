import { ComponentDriver, Optional } from '@atomic-testing/core';

/**
 * Driver for a single Fluent v9 Dropdown `Option` (`role="option"`, class
 * `fui-Option`) as rendered inside a SINGLE-select `Dropdown`'s listbox — DOM
 * audit, `@fluentui/react-components@9.74.3`. A `multiselect` Dropdown renders
 * its options differently (`role="menuitemcheckbox"` with `aria-checked`, not
 * `role="option"` with `aria-selected`) — see `DropdownDriver`'s class doc —
 * so this driver only applies to options read from a single-select `Dropdown`.
 */
export class DropdownOptionDriver extends ComponentDriver<{}> {
  /** The option's visible label (trimmed text content), or `undefined` when empty. */
  async getLabel(): Promise<Optional<string>> {
    return (await this.getText())?.trim() || undefined;
  }

  /** Whether this option is the one currently selected, via `aria-selected`. */
  async isSelected(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-selected')) === 'true';
  }

  /**
   * Whether the option is disabled, via `aria-disabled` — Fluent renders an
   * option as a plain `<div role="option">`, which has no native `disabled`
   * attribute to reflect instead.
   */
  async isDisabled(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-disabled')) === 'true';
  }

  get driverName(): string {
    return 'FluentV9DropdownOptionDriver';
  }
}
