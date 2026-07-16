import { ComponentDriver, Optional } from '@atomic-testing/core';

/**
 * Driver for a single Fluent v9 `Option` (`role="option"`, class `fui-Option`)
 * inside a `Combobox`'s listbox — DOM audit (@fluentui/react-components@9.74.3).
 *
 * Deliberately a standalone class rather than extending Wave 2's
 * `MenuItemDriver`: the two share a similar `getLabel`/`isDisabled` shape by
 * coincidence, but `role="option"`/`aria-selected` (a listbox selection
 * primitive) and `role="menuitem"`/`aria-disabled` (a menu-command primitive)
 * are different ARIA concepts — an inheritance link between them would imply
 * a relationship that isn't real. See `ComboboxDriver`'s class doc for why
 * this selector does not match `multiselect` mode (Fluent swaps the role to
 * `"menuitemcheckbox"` there).
 */
export class ComboboxOptionDriver extends ComponentDriver<{}> {
  /** The option's visible, trimmed text, or `undefined` when empty. */
  async getLabel(): Promise<Optional<string>> {
    return (await this.getText())?.trim() ?? undefined;
  }

  /** Whether the option is disabled — Fluent marks this with `aria-disabled="true"`. */
  async isDisabled(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-disabled')) === 'true';
  }

  /** Whether the option is the Combobox's current selection (`aria-selected="true"`). */
  async isSelected(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-selected')) === 'true';
  }

  get driverName(): string {
    return 'FluentV9ComboboxOptionDriver';
  }
}
