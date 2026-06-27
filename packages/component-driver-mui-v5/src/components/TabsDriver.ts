import {
  byRole,
  IComponentDriverOption,
  Interactor,
  ListComponentDriver,
  ListComponentDriverSpecificOption,
  listHelper,
  Nullable,
  PartLocator,
} from '@atomic-testing/core';

import { TabDriver } from './TabDriver';

/**
 * Tabs are located by their accessible `role="tab"` children rather than by MUI
 * class names, so the driver is resilient to MUI styling/version changes.
 */
export const defaultTabsDriverOption: ListComponentDriverSpecificOption<TabDriver> = {
  itemClass: TabDriver,
  itemLocator: byRole('tab'),
};

type TabsDriverOption<ItemT extends TabDriver> = ListComponentDriverSpecificOption<ItemT> &
  Partial<IComponentDriverOption<any>>;

/**
 * Driver for the Material UI v7 Tabs component.
 *
 * `<Tabs>` renders a `role="tablist"` whose `role="tab"` buttons carry the
 * selected (`aria-selected`) and disabled state. This driver is a
 * {@link ListComponentDriver} over those tabs, exposing both group-level helpers
 * (selected index/label, select by index/label) and per-tab {@link TabDriver}
 * instances via `getItems`/`getItemByIndex`/`getItemByLabel`.
 * @see https://mui.com/material-ui/react-tabs/
 */
export class TabsDriver<ItemT extends TabDriver = TabDriver> extends ListComponentDriver<ItemT> {
  constructor(locator: PartLocator, interactor: Interactor, option: Partial<TabsDriverOption<ItemT>> = {}) {
    // A tab group's item shape is fixed (role="tab" buttons driven by TabDriver),
    // so the defaults are merged in rather than relying on a default parameter:
    // the test engine always passes an option object for a scene part, which would
    // otherwise shadow a default-valued parameter and leave itemLocator unset.
    super(locator, interactor, {
      ...defaultTabsDriverOption,
      ...option,
    } as TabsDriverOption<ItemT>);
  }

  /**
   * The visible label of every tab, in DOM order.
   */
  async getTabLabels(): Promise<string[]> {
    const labels: string[] = [];
    for await (const tab of listHelper.getListItemIterator(this, this.getItemLocator(), TabDriver)) {
      const text = await tab.getText();
      labels.push(text?.trim() ?? '');
    }
    return labels;
  }

  /**
   * The number of tabs in the group.
   */
  async getTabCount(): Promise<number> {
    return this.getItemCount();
  }

  /**
   * Zero-based index of the selected tab, or `-1` when no tab is selected
   * (e.g. `<Tabs value={false}>`).
   */
  async getSelectedIndex(): Promise<number> {
    let index = 0;
    for await (const tab of listHelper.getListItemIterator(this, this.getItemLocator(), TabDriver)) {
      if (await tab.isSelected()) {
        return index;
      }
      index++;
    }
    return -1;
  }

  /**
   * Label of the selected tab, or `null` when no tab is selected. Returns `null`
   * (not `undefined`) to match the sibling `SelectDriver.getSelectedLabel` contract.
   */
  async getSelectedLabel(): Promise<Nullable<string>> {
    for await (const tab of listHelper.getListItemIterator(this, this.getItemLocator(), TabDriver)) {
      if (await tab.isSelected()) {
        return (await tab.getText())?.trim() ?? null;
      }
    }
    return null;
  }

  /**
   * Select the tab at the given zero-based index.
   * @returns `false` when the index is out of range.
   */
  async selectByIndex(index: number): Promise<boolean> {
    const tab = await this.getItemByIndex(index);
    if (tab == null) {
      return false;
    }
    await tab.click();
    return true;
  }

  /**
   * Select the first tab whose visible label equals `label`.
   * @returns `false` when no tab matches.
   */
  async selectByLabel(label: string): Promise<boolean> {
    const tab = await this.getItemByLabel(label);
    if (tab == null) {
      return false;
    }
    await tab.click();
    return true;
  }

  /**
   * Whether the tab at the given index is disabled.
   * @returns `false` when the index is out of range.
   */
  async isTabDisabled(index: number): Promise<boolean> {
    const tab = await this.getItemByIndex(index);
    return tab == null ? false : tab.isDisabled();
  }

  override get driverName(): string {
    return 'MuiV5TabsDriver';
  }
}
