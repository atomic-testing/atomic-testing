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

export const defaultTabsDriverOption: ListComponentDriverSpecificOption<TabDriver> = {
  itemClass: TabDriver,
  itemLocator: byRole('tab'),
};

type TabsDriverOption<ItemT extends TabDriver> = ListComponentDriverSpecificOption<ItemT> &
  Partial<IComponentDriverOption<any>>;

/**
 * Driver for the Reka UI Tabs primitive (`TabsRoot`/`TabsList`/`TabsTrigger`/
 * `TabsContent` from `reka-ui`).
 *
 * DOM audit (reka-ui@2.10.1, SSR-rendered): byte-for-byte the same contract as
 * `component-driver-radix-v1`'s `TabsDriver` — `TabsList` renders
 * `role="tablist"`, each `TabsTrigger` a `<button role="tab" aria-selected
 * data-state="active"/"inactive" disabled>`, and each `TabsContent` a
 * `role="tabpanel"` linked back to its trigger via the trigger's
 * `aria-controls` pointing at the panel's `id`. One confirmed timing delta
 * from a byte-for-byte match: Reka populates `aria-controls` from
 * `TabsContent`'s `onMounted` hook registering its id into a shared reactive
 * set, so the attribute is absent on the very first synchronous render and
 * only appears after the next tick — the same "render-order-dependent" hazard
 * the ported `getPanelText` below already documents for Radix, confirmed
 * empirically to also apply here (a freshly-mounted trigger's `outerHTML` was
 * read before and after a tick with no interaction in between). Every method
 * on this driver is `async` and goes through the `Interactor`, so by the time
 * any caller reads `aria-controls` the tick has always already elapsed — this
 * is a documented hazard, not an observed failure.
 *
 * Clicking a `disabled` trigger is a genuine no-op in Reka — its `mousedown`
 * handler checks `disabled` before calling into the root's
 * `changeModelValue` (verified by dispatching a click at a disabled trigger
 * and observing the model does not change). `TabDriver.select()` carries no
 * disabled guard of its own (ported unchanged from Radix), so calling
 * `selectByIndex`/`selectByLabel` against a disabled tab would still issue
 * the click. That is safe under jsdom only: `Interactor.click`'s
 * `userEvent.click` silently skips a disabled button there, but Playwright's
 * actionability check instead waits for the element to become enabled until
 * its own timeout — so this driver's test suite deliberately never calls
 * `selectByIndex`/`selectByLabel` against the disabled tab, reading its state
 * via `isTabDisabled` only (mirrors the reasoning `SwitchDriver.setSelected`
 * documents for the identical jsdom/Playwright split).
 */
export class TabsDriver<ItemT extends TabDriver = TabDriver> extends ListComponentDriver<ItemT> {
  constructor(locator: PartLocator, interactor: Interactor, option: Partial<TabsDriverOption<ItemT>> = {}) {
    super(locator, interactor, {
      ...defaultTabsDriverOption,
      ...option,
    } as TabsDriverOption<ItemT>);
  }

  async getTabLabels(): Promise<string[]> {
    const labels: string[] = [];
    for await (const tab of listHelper.getListItemIterator(this, this.getItemLocator(), TabDriver)) {
      labels.push((await tab.getText())?.trim() ?? '');
    }
    return labels;
  }

  async getTabCount(): Promise<number> {
    return this.getItemCount();
  }

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

  async getSelectedLabel(): Promise<Nullable<string>> {
    for await (const tab of listHelper.getListItemIterator(this, this.getItemLocator(), TabDriver)) {
      if (await tab.isSelected()) {
        return (await tab.getText())?.trim() ?? null;
      }
    }
    return null;
  }

  async selectByIndex(index: number): Promise<boolean> {
    const tab = await this.getItemByIndex(index);
    if (tab == null) return false;
    await tab.select();
    return true;
  }

  async selectByLabel(label: string): Promise<boolean> {
    const tab = await this.getItemByLabel(label);
    if (tab == null) return false;
    await tab.select();
    return true;
  }

  async isTabDisabled(index: number): Promise<boolean> {
    const tab = await this.getItemByIndex(index);
    return tab == null ? false : tab.isDisabled();
  }

  // Reka's ids are render-order-dependent (see class doc), so resolve the
  // aria-controls link at read time rather than caching it.
  async getPanelText(index: number): Promise<Optional<string>> {
    const tab = await this.getItemByIndex(index);
    if (tab == null) return undefined;
    const panelId = await this.interactor.getAttribute(tab.locator, 'aria-controls');
    if (!panelId) return undefined;
    const panel = byAttribute('id', panelId, 'Root');
    return (await this.interactor.exists(panel)) ? this.interactor.getText(panel) : undefined;
  }

  override get driverName(): string {
    return 'RekaUiV2TabsDriver';
  }
}
