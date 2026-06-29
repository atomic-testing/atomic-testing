import {
  byCssSelector,
  IComponentDriverOption,
  Interactor,
  listHelper,
  ListComponentDriver,
  PartLocator,
} from '@atomic-testing/core';

import { ListItemDriver } from './ListItemDriver';

/**
 * Driver for the Astryx List (`@astryxdesign/core/List`).
 *
 * The scene anchors this driver on the list root, which self-emits `data-testid`
 * on the `<ul>`/`<ol>` and carries `data-list-style` (`'none'` | `'decimal'` | …).
 * Rows are addressed positionally as `<li>` children (the `listitem` role is
 * implicit, so the `<li>` tag is the portable anchor); per-row state (selected,
 * disabled, link, label) is read by {@link ListItemDriver} from ARIA on the `<li>`.
 *
 * Astryx renders the full list in the DOM (no virtualization), so every accessor
 * is faithful in jsdom as well as the browser.
 */
export class ListDriver extends ListComponentDriver<ListItemDriver> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, { itemClass: ListItemDriver, itemLocator: byCssSelector('li'), ...option });
  }

  /** Every row's visible label, in DOM order. */
  async getItemLabels(): Promise<readonly string[]> {
    const items = await this.getItems();
    return listHelper.collectItemLabels(items);
  }

  /** The labels of the currently selected rows (`aria-selected="true"`), in DOM order. */
  async getSelectedLabels(): Promise<readonly string[]> {
    const selected: string[] = [];
    for (const item of await this.getItems()) {
      if (await item.isSelected()) {
        const label = await item.getLabel();
        if (label != null) {
          selected.push(label);
        }
      }
    }
    return selected;
  }

  /** Whether the row with the given label is selected. `false` when absent. */
  async isItemSelected(label: string): Promise<boolean> {
    const item = await this.getItemByLabel(label);
    return item != null && (await item.isSelected());
  }

  /** Whether the row with the given label is disabled. `false` when absent. */
  async isItemDisabled(label: string): Promise<boolean> {
    const item = await this.getItemByLabel(label);
    return item != null && (await item.isDisabled());
  }

  /**
   * Click the row with the given label.
   * @returns `false` when no such row exists.
   */
  async clickItem(label: string): Promise<boolean> {
    const item = await this.getItemByLabel(label);
    if (item == null) {
      return false;
    }
    await item.click();
    return true;
  }

  /** Whether the list is ordered — Astryx renders an `<ol>` with `data-list-style="decimal"`. */
  async isOrdered(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'data-list-style')) === 'decimal';
  }

  override get driverName(): string {
    return 'AstryxListDriver';
  }
}
