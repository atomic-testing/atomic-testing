import {
  byAttribute,
  byRole,
  IComponentDriverOption,
  Interactor,
  ListComponentDriver,
  ListComponentDriverSpecificOption,
  listHelper,
  Nullable,
  Optional,
  PartLocator,
} from '@atomic-testing/core';

import { TabDriver } from './TabDriver';

/**
 * Tabs are located by their accessible `role="tab"` children rather than a
 * forwarded `data-testid`, so the driver is resilient to consumer markup
 * changes around the tab list.
 */
export const defaultTabsDriverOption: ListComponentDriverSpecificOption<TabDriver> = {
  itemClass: TabDriver,
  itemLocator: byRole('tab'),
};

type TabsDriverOption<ItemT extends TabDriver> = ListComponentDriverSpecificOption<ItemT> &
  Partial<IComponentDriverOption<any>>;

/**
 * Driver for the Radix Tabs primitive (`Tabs.Root` from `radix-ui`).
 *
 * `Tabs.List` wraps `role="tab"` triggers carrying `aria-selected`,
 * `data-state="active"/"inactive"`, and `data-disabled`+`disabled` when
 * disabled; each is linked both ways to its `role="tabpanel"` via
 * `aria-controls`/`aria-labelledby`. This driver is a {@link ListComponentDriver}
 * over the tabs — group-level helpers plus per-tab {@link TabDriver} instances —
 * templated off `component-driver-mui-v7`'s `TabsDriver`/`TabDriver` pair per
 * the issue's own "Tabs -> TabsDriver" guidance.
 * @see https://www.radix-ui.com/primitives/docs/components/tabs
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

  /** The visible label of every tab, in DOM order. */
  async getTabLabels(): Promise<string[]> {
    const labels: string[] = [];
    for await (const tab of listHelper.getListItemIterator(this, this.getItemLocator(), TabDriver)) {
      labels.push((await tab.getText())?.trim() ?? '');
    }
    return labels;
  }

  /** The number of tabs in the group. */
  async getTabCount(): Promise<number> {
    return this.getItemCount();
  }

  /** Zero-based index of the selected tab, or `-1` when none is selected. */
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

  /** Label of the selected tab, or `null` when no tab is selected. */
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
    await tab.select();
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
    await tab.select();
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

  /**
   * Text of the panel linked to the tab at the given index via `aria-controls`,
   * or `undefined` when the index is out of range or the tab has no linked
   * panel. Radix's ids (`radix-_r_0_`) are render-order-dependent, so this
   * resolves the link at read time rather than hardcoding one.
   */
  async getPanelText(index: number): Promise<Optional<string>> {
    const tab = await this.getItemByIndex(index);
    if (tab == null) {
      return undefined;
    }
    const panelId = await this.interactor.getAttribute(tab.locator, 'aria-controls');
    if (!panelId) {
      return undefined;
    }
    const panel = byAttribute('id', panelId, 'Root');
    return (await this.interactor.exists(panel)) ? this.interactor.getText(panel) : undefined;
  }

  override get driverName(): string {
    return 'RadixV1TabsDriver';
  }
}
