import { byTagName, ComponentDriver, listHelper, locatorUtil, PartLocator } from '@atomic-testing/core';

import { ToggleDriver } from './ToggleDriver';

const itemLocator = byTagName('button');

/**
 * Driver for the Reka UI ToggleGroup primitive (`ToggleGroupRoot` from `reka-ui`).
 *
 * DOM audit (reka-ui@2.10.1, SSR-rendered): items render as plain `<button
 * type="button" aria-pressed="true"/"false" data-state="on"/"off"
 * data-reka-collection-item value="...">` — the same `data-state` shape as a
 * standalone `Toggle` (`ToggleGroupItem` composes `Toggle` internally), so
 * items are modelled with {@link ToggleDriver}, verified selected via
 * `data-state` uniformly across both selection modes.
 *
 * Two confirmed deltas from `component-driver-radix-v1`'s `ToggleGroupDriver`:
 *
 * 1. **Root role**: Radix's root carries `role="radiogroup"` in `type="single"`
 *    mode and `role="toolbar"` in `type="multiple"` mode. Reka's root carries
 *    `role="group"` in **both** modes — verified by rendering each. Neither
 *    role is read by this driver, so it does not change the method surface,
 *    but it means an `aria-role`-based item lookup could not distinguish
 *    single from multiple groups the way Radix's could.
 * 2. **`value` reflection**: unlike Radix (whose driver docs this attribute as
 *    absent), Reka's `ToggleGroupItem` DOES reflect its `value` prop as a
 *    `value` attribute on the rendered `<button>` — verified in both
 *    selection modes. This driver still exposes only index/label lookup to
 *    keep the ported method surface identical to `component-driver-radix-v1`;
 *    a value-based lookup is a possible follow-up, not implemented here.
 *
 * Also unlike `RadioGroupDriver`, items in single mode carry `aria-pressed`
 * (not `aria-checked`+`role="radio"`) — Reka's `type="single"` and
 * `type="multiple"` groups both delegate to the same `Toggle` primitive
 * underneath, so `data-state` (what {@link ToggleDriver} reads) is the one
 * signal that is uniform across modes.
 */
export class ToggleGroupDriver extends ComponentDriver<{}> {
  private get itemsLocator(): PartLocator {
    return locatorUtil.append(this.locator, itemLocator);
  }

  async getItemByIndex(index: number): Promise<ToggleDriver | null> {
    return listHelper.getListItemByIndex(this, this.itemsLocator, index, ToggleDriver);
  }

  async getItemByLabel(label: string): Promise<ToggleDriver | null> {
    for await (const item of listHelper.getListItemIterator(this, this.itemsLocator, ToggleDriver)) {
      if ((await item.getText())?.trim() === label) {
        return item;
      }
    }
    return null;
  }

  async getItemCount(): Promise<number> {
    return listHelper.getListItemCount(this, this.itemsLocator);
  }

  async getItemLabels(): Promise<string[]> {
    const labels: string[] = [];
    for await (const item of listHelper.getListItemIterator(this, this.itemsLocator, ToggleDriver)) {
      labels.push((await item.getText())?.trim() ?? '');
    }
    return labels;
  }

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
    return 'RekaUiV2ToggleGroupDriver';
  }
}
