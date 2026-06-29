import {
  byCssSelector,
  IComponentDriverOption,
  Interactor,
  ListComponentDriver,
  Optional,
  PartLocator,
} from '@atomic-testing/core';

import { OutlineItemDriver } from './OutlineItemDriver';

/**
 * Driver for the Astryx Outline (`@astryxdesign/core/Outline`) — a table-of-contents
 * navigation.
 *
 * The scene anchors this driver on the `<nav>`, which self-emits `data-testid`. Each
 * entry is a `<li role="listitem">` wrapping one anchor; all rows share the `<ul>`
 * parent, so the `<li>` tag is the portable item anchor and per-row data lives on
 * the inner `<a>` (see {@link OutlineItemDriver}). The active entry is whichever
 * anchor carries `aria-current="true"`: with an explicit `activeId` this is
 * deterministic in jsdom; without it Astryx derives it from scroll position
 * (scroll-spy), which has no layout in jsdom and is therefore an E2E-only concern.
 */
export class OutlineDriver extends ListComponentDriver<OutlineItemDriver> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, { itemClass: OutlineItemDriver, itemLocator: byCssSelector('li'), ...option });
  }

  /** Every entry's visible label, in DOM order. */
  async getItemLabels(): Promise<readonly string[]> {
    const items = await this.getItems();
    const labels = await Promise.all(items.map(item => item.getLabel()));
    return labels.filter((label): label is string => label != null);
  }

  /** The active entry's label (`aria-current="true"`), or `undefined` when none is active. */
  async getActiveLabel(): Promise<Optional<string>> {
    for (const item of await this.getItems()) {
      if (await item.isActive()) {
        return item.getLabel();
      }
    }
    return undefined;
  }

  /** The `href` of the entry with the given label, or `undefined` when absent. */
  async getHref(label: string): Promise<Optional<string>> {
    const item = await this.getItemByLabel(label);
    return item == null ? undefined : item.getHref();
  }

  /** The heading depth of the entry with the given label, or `undefined` when absent. */
  async getLevel(label: string): Promise<Optional<number>> {
    const item = await this.getItemByLabel(label);
    return item == null ? undefined : item.getLevel();
  }

  /**
   * Click the entry with the given label.
   * @returns `false` when no such entry exists.
   */
  async clickItem(label: string): Promise<boolean> {
    const item = await this.getItemByLabel(label);
    if (item == null) {
      return false;
    }
    await item.click();
    return true;
  }

  override get driverName(): string {
    return 'AstryxOutlineDriver';
  }
}
