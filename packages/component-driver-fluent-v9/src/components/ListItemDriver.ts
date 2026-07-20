import { ComponentDriver, IToggleDriver, Optional } from '@atomic-testing/core';

/**
 * Driver for a single Fluent v9 `ListItem` (see {@link ListDriver}).
 *
 * DOM audit (@fluentui/react-components@9.74.3): renders `<li>` (or `<div>`
 * when `as="div"`) whose `value` prop reflects directly onto a plain `value`
 * attribute — an un-hashed, portable read, unlike most Fluent components in
 * this package whose prop values have no DOM reflection at all.
 * `aria-selected` is present only when the parent `List`'s `selectionMode`
 * is set (`'single'`/`'multiselect'`); with no selection mode it is absent
 * entirely, not merely `"false"` — {@link isSelected} treats absence the same
 * as `"false"`, so it is only meaningful to assert on when the list is
 * actually selectable (see the package README's Known gaps).
 */
export class ListItemDriver extends ComponentDriver<{}> implements IToggleDriver {
  /** The item's `value` prop, read from the reflected `value` attribute. */
  async getValue(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'value');
  }

  /** Whether the item is selected. Always `false` when the list has no `selectionMode` (see class doc). */
  async isSelected(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-selected')) === 'true';
  }

  /**
   * Toggle selection by clicking the item. No-ops if already in the desired
   * state, or if the parent list has no `selectionMode` at all
   * (`aria-selected` entirely absent, per the class doc) — clicking in that
   * case would still fire the item's `onAction` handler with no selection
   * state to actually toggle, a misleading side effect for a caller that
   * asked specifically for selection.
   */
  async setSelected(selected: boolean): Promise<void> {
    const isSelectable = await this.interactor.hasAttribute(this.locator, 'aria-selected');
    if (!isSelectable) {
      return;
    }
    const currentSelected = await this.isSelected();
    if (currentSelected === selected) {
      return;
    }
    await this.click();
  }

  get driverName(): string {
    return 'FluentV9ListItemDriver';
  }
}
