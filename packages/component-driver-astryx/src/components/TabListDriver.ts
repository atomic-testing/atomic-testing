import { byCssSelector, ComponentDriver, locatorUtil, Optional } from '@atomic-testing/core';

import { countMatchingChildren, getMatchingChildren } from '../internal/childListHelper';
import { TabDriver } from './TabDriver';

/**
 * Real tabs are the `<nav>`'s direct `<button>`/`<a>` children, excluding the
 * overflow menu trigger (`aria-haspopup="menu"`) and the overflow popover panel
 * (a `<div>`). Expressed without a `,` union so the scope is not lost.
 */
const TAB_SELECTOR = ':not(div):not([aria-haspopup="menu"])';
const activeTab = byCssSelector('[aria-current="page"]');

/**
 * Driver for the Astryx TabList (`@astryxdesign/core/TabList`).
 *
 * TabList renders a `<nav aria-label="Tabs">` whose direct children are the tabs
 * (`<button>`/`<a>`) followed, when overflow is configured, by a `TabMenu`
 * trigger and its popover panel. The active tab carries `aria-current="page"`
 * (there is no `role="tab"`/`role="tablist"`). Tabs are iterated positionally over
 * the nav's children — filtered by {@link TAB_SELECTOR} so the overflow trigger
 * and panel are skipped — and matched by their de-duplicated visible label.
 *
 * The overflow menu's open/close is a native-popover behaviour that is only
 * meaningful in the E2E run; the base tabs (labels, count, active state,
 * selection) read faithfully in jsdom.
 */
export class TabListDriver extends ComponentDriver {
  /** Every tab driver, in DOM order (excludes the overflow trigger). */
  async getItems(): Promise<TabDriver[]> {
    return getMatchingChildren(this, this.locator, TAB_SELECTOR, TabDriver);
  }

  /** Number of tabs (excludes the overflow trigger). */
  async getItemCount(): Promise<number> {
    return countMatchingChildren(this.interactor, this.locator, TAB_SELECTOR);
  }

  /** Every tab's visible label, in DOM order. */
  async getItemLabels(): Promise<readonly string[]> {
    const items = await this.getItems();
    const labels = await Promise.all(items.map(tab => tab.getLabel()));
    return labels.filter((label): label is string => label != null);
  }

  /** The active tab's visible label (`aria-current="page"`), or `undefined` when none. */
  async getActiveLabel(): Promise<Optional<string>> {
    const active = new TabDriver(locatorUtil.append(this.locator, activeTab), this.interactor, this.commutableOption);
    if (!(await active.exists())) {
      return undefined;
    }
    return active.getLabel();
  }

  /** The tab driver whose visible label matches, or `null` when absent. */
  async getTabByLabel(label: string): Promise<TabDriver | null> {
    for (const tab of await this.getItems()) {
      if ((await tab.getLabel())?.trim() === label) {
        return tab;
      }
    }
    return null;
  }

  /**
   * Select the tab whose visible label matches `label`.
   * @returns `false` when no such tab exists.
   */
  async selectTab(label: string): Promise<boolean> {
    const tab = await this.getTabByLabel(label);
    if (tab == null) {
      return false;
    }
    await tab.click();
    return true;
  }

  /** Whether the tab with the given label is active. `false` when absent. */
  async isActive(label: string): Promise<boolean> {
    const tab = await this.getTabByLabel(label);
    return tab != null && (await tab.isActive());
  }

  /** The `href` of the tab with the given label, or `undefined` when absent/not a link. */
  async getTabHref(label: string): Promise<Optional<string>> {
    const tab = await this.getTabByLabel(label);
    return tab == null ? undefined : tab.getHref();
  }

  override get driverName(): string {
    return 'AstryxTabListDriver';
  }
}
