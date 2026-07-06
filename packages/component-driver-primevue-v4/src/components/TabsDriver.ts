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
 * Tabs are located by their accessible `role="tab"` children rather than
 * PrimeVue structure classes, so the driver ignores TabList chrome (the
 * active-bar span and the scrollable-mode nav buttons render alongside the
 * tabs but never carry the role).
 */
export const defaultTabsDriverOption: ListComponentDriverSpecificOption<TabDriver> = {
  itemClass: TabDriver,
  itemLocator: byRole('tab'),
};

type TabsDriverOption<ItemT extends TabDriver> = ListComponentDriverSpecificOption<ItemT> &
  Partial<IComponentDriverOption<any>>;

/**
 * Driver for the PrimeVue `Tabs` component (the v4 replacement for `TabView`:
 * `Tabs`/`TabList`/`Tab`/`TabPanels`/`TabPanel`).
 *
 * DOM audit (primevue@4.5.5): the `Tabs` root (`data-pc-name="tabs"`, where a
 * forwarded `data-testid` lands) wraps a `role="tablist"` of
 * `<button role="tab" aria-selected aria-controls>` triggers and a panel
 * group of `role="tabpanel"` divs linked back via `aria-labelledby`/`id` —
 * the standard ARIA tabs pattern. Unselected panels STAY MOUNTED with
 * `display: none` (unlike Radix, which unmounts them), so
 * {@link TabsDriver.getPanelText} reads any panel's text regardless of
 * selection; assert selection through `isSelected`/`getSelectedLabel`.
 * This driver is a {@link ListComponentDriver} over the tabs — group-level
 * helpers plus per-tab {@link TabDriver} instances — mirroring the Radix
 * `TabsDriver`/`TabDriver` pair so cross-library docs stay coherent.
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
    for await (const tab of listHelper.getListItemIterator(this, this.getItemLocator(), this.getItemClass())) {
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
    for await (const tab of listHelper.getListItemIterator(this, this.getItemLocator(), this.getItemClass())) {
      if (await tab.isSelected()) {
        return index;
      }
      index++;
    }
    return -1;
  }

  /** Label of the selected tab, or `null` when no tab is selected. */
  async getSelectedLabel(): Promise<Nullable<string>> {
    for await (const tab of listHelper.getListItemIterator(this, this.getItemLocator(), this.getItemClass())) {
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
   * Text of the panel linked to the tab at the given index via
   * `aria-controls`, or `undefined` when the index is out of range or the tab
   * has no linked panel. PrimeVue's ids (`pv_id_N_tabpanel_M`) are
   * render-order-dependent, so the link is resolved at read time rather than
   * hardcoded. Note the panel stays mounted (hidden) when unselected — see
   * the class doc.
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
    return 'PrimeVueV4TabsDriver';
  }
}
