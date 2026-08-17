import { byCssSelector, ComponentDriverCtor, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

import { PositionalListDriver } from '../internal/PositionalListDriver';
import { TabDriver } from './TabDriver';

/**
 * Real tabs are the `<nav>`'s direct children carrying `data-tab-value` — the
 * per-tab identity Astryx emits on each `<button>`/`<a>`.
 *
 * This is deliberately a **positive** match. The previous exclusion list
 * (`:not(div):not([aria-haspopup="menu"])`) was open by construction: it named the
 * two non-tab children that existed at the time, so the inert `<template>` markers
 * Astryx 0.4.2 started emitting for each context layer matched it and inflated the
 * tab count. An attribute every tab has and nothing else does cannot drift that
 * way — the overflow trigger carries `data-tab-menu`, not `data-tab-value`.
 */
const TAB_SELECTOR = '[data-tab-value]';
const activeTab = byCssSelector('[aria-current="page"]');

/**
 * Driver for the Astryx TabList (`@astryxdesign/core/TabList`).
 *
 * TabList renders a `<nav aria-label="Tabs">` whose direct children are the tabs
 * (`<button>`/`<a>`) followed, when overflow is configured, by a `TabMenu`
 * trigger and its popover panel. The active tab carries `aria-current="page"`
 * (there is no `role="tab"`/`role="tablist"`). The labels/count/lookup/select
 * surface comes from {@link PositionalListDriver} — the tabs are the nav's direct
 * children ({@link resolveListContainer} returns the nav), filtered by
 * {@link TAB_SELECTOR} so the overflow trigger, its panel and the layer markers
 * around them are skipped (no section recursion). This class adds the tab-specific
 * reads (active tab, href).
 *
 * The overflow menu's open/close is a native-popover behaviour that is only
 * meaningful in the E2E run; the base tabs (labels, count, active state,
 * selection) read faithfully in jsdom.
 */
export class TabListDriver extends PositionalListDriver<TabDriver> {
  protected readonly itemSelector = TAB_SELECTOR;
  protected readonly itemDriverClass: ComponentDriverCtor<TabDriver> = TabDriver;

  protected override resolveListContainer(): Promise<Optional<PartLocator>> {
    return Promise.resolve(this.locator);
  }

  /** The active tab's visible label (`aria-current="page"`), or `undefined` when none. */
  async getActiveLabel(): Promise<Optional<string>> {
    const active = new TabDriver(locatorUtil.append(this.locator, activeTab), this.interactor, this.commutableOption);
    if (!(await active.exists())) {
      return undefined;
    }
    return active.getLabel();
  }

  /**
   * Select the tab whose visible label matches `label`. Alias of
   * {@link PositionalListDriver.selectByLabel} that reads as tab intent.
   * @returns `false` when no such tab exists.
   */
  async selectTab(label: string): Promise<boolean> {
    return this.selectByLabel(label);
  }

  /** Whether the tab with the given label is active. `false` when absent. */
  async isActive(label: string): Promise<boolean> {
    const tab = await this.getItemByLabel(label);
    return tab != null && (await tab.isActive());
  }

  /** The `href` of the tab with the given label, or `undefined` when absent/not a link. */
  async getTabHref(label: string): Promise<Optional<string>> {
    const tab = await this.getItemByLabel(label);
    return tab == null ? undefined : tab.getHref();
  }

  override get driverName(): string {
    return 'AstryxTabListDriver';
  }
}
