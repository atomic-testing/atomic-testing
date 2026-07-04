import { byTagName, ComponentDriver, listHelper, locatorUtil, PartLocator } from '@atomic-testing/core';

import { ToggleDriver } from './ToggleDriver';

const itemLocator = byTagName('button');

/**
 * Driver for the Radix ToggleGroup primitive (`ToggleGroup.Root` from `radix-ui`).
 *
 * Items render as plain `<button>`s carrying `data-state="on"/"off"` — the
 * same shape as a standalone `Toggle.Root` — so items are modelled with
 * {@link ToggleDriver} (selected via `data-state`; `type="single"` additionally
 * mirrors it as `aria-checked`+`role="radio"`, `type="multiple"` as
 * `aria-pressed`, but `data-state` reads uniformly across both modes).
 *
 * Radix does **not** reflect the consumer's `value` prop onto the rendered
 * `<button>` (no `value` attribute appears in the DOM for either selection
 * mode), so — unlike `RadioGroupDriver` — items cannot be looked up by value,
 * only by index or visible label. This mirrors the enumerable-item, label-match
 * pattern `MenuDriver.getMenuItemByLabel` already uses per the #923 decision
 * recorded in `agent-docs/modules/component-driver-radix.md`.
 */
export class ToggleGroupDriver extends ComponentDriver<{}> {
  private get itemsLocator(): PartLocator {
    return locatorUtil.append(this.locator, itemLocator);
  }

  /** Get the item at the given zero-based index, or `null` if out of range. */
  async getItemByIndex(index: number): Promise<ToggleDriver | null> {
    return listHelper.getListItemByIndex(this, this.itemsLocator, index, ToggleDriver);
  }

  /** Get the item whose visible label (text content) matches, or `null` if none. */
  async getItemByLabel(label: string): Promise<ToggleDriver | null> {
    for await (const item of listHelper.getListItemIterator(this, this.itemsLocator, ToggleDriver)) {
      if ((await item.getText())?.trim() === label) {
        return item;
      }
    }
    return null;
  }

  /** Number of items in the group. */
  async getItemCount(): Promise<number> {
    return listHelper.getListItemCount(this, this.itemsLocator);
  }

  /** Visible labels of every item, in DOM order. */
  async getItemLabels(): Promise<string[]> {
    const labels: string[] = [];
    for await (const item of listHelper.getListItemIterator(this, this.itemsLocator, ToggleDriver)) {
      labels.push((await item.getText())?.trim() ?? '');
    }
    return labels;
  }

  /** Visible labels of the currently selected item(s), in DOM order. */
  async getSelectedLabels(): Promise<string[]> {
    const labels: string[] = [];
    for await (const item of listHelper.getListItemIterator(this, this.itemsLocator, ToggleDriver)) {
      if (await item.isSelected()) {
        labels.push((await item.getText())?.trim() ?? '');
      }
    }
    return labels;
  }

  get driverName(): string {
    return 'RadixV1ToggleGroupDriver';
  }
}
