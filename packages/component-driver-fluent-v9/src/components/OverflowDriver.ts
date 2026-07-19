import { byCssSelector, childListHelper, ComponentDriver, locatorUtil, PartLocator } from '@atomic-testing/core';

import { MenuDriver } from './MenuDriver';
import { OverflowItemDriver } from './OverflowItemDriver';

const overflowItemSelector = '[data-overflow-item]';
const overflowMenuTriggerLocator = byCssSelector('[data-overflow-menu]');

/**
 * Driver for the Fluent v9 `Overflow` container (holding `OverflowItem`
 * children — see {@link OverflowItemDriver} — and, typically, an
 * overflow-menu trigger reached via {@link getOverflowMenu}).
 *
 * DOM audit (@fluentui/react-overflow@9.9.0): `Overflow` itself is a pure
 * behavior/measurement primitive — like `OverflowItem`, it renders no
 * wrapper of its own, cloning a `ref` + the class `fui-Overflow` onto its
 * OWN child (the consumer's own row/toolbar element). So the scene's locator
 * for this driver must point at THAT element, not at `<Overflow>` (which has
 * no DOM presence to locate). Item enumeration assumes the idiomatic flat-row
 * usage — every `OverflowItem`'s underlying element is a DIRECT child of the
 * `Overflow`-wrapped container (`childListHelper`'s `:nth-child` walk, no
 * `groupSelector` recursion) — the shape this package's own example scene
 * uses; a consumer nesting `OverflowItem`s inside extra wrapper elements
 * would need a different container locator.
 *
 * **No dedicated `OverflowMenuDriver` class**: `useOverflowMenu()` renders
 * nothing of its own — it wires a consumer-supplied trigger (typically a
 * `MenuTrigger`'s child) to a `data-overflow-menu` attribute and leaves
 * building the actual `Menu`/`MenuList` entirely to the consumer (grepped
 * the whole package: no `Menu`/`MenuTrigger` reference anywhere in it). The
 * "+N" trigger a consumer builds this way IS an ordinary Fluent `Menu`, so
 * {@link getOverflowMenu} just returns this package's own Wave 2
 * {@link MenuDriver}, constructed from the `[data-overflow-menu]` element as
 * its trigger — no new portal-resolution logic needed.
 */
export class OverflowDriver extends ComponentDriver<{}> {
  /** The number of registered items, visible or overflowed. */
  async getItemCount(): Promise<number> {
    return childListHelper.countMatchingChildren(this.interactor, this.locator, overflowItemSelector);
  }

  /** The visible label of every registered item, in DOM order (visible and overflowed alike). */
  async getItemLabels(): Promise<string[]> {
    const labels: string[] = [];
    for await (const item of this.iterateItems()) {
      labels.push((await item.getLabel()) ?? '');
    }
    return labels;
  }

  /** The first registered item whose visible label matches `label`, or `null` when absent. */
  async getItemByLabel(label: string): Promise<OverflowItemDriver | null> {
    for await (const item of this.iterateItems()) {
      if ((await item.getLabel()) === label) {
        return item;
      }
    }
    return null;
  }

  /** The visible labels of items currently overflowed (hidden behind the "+N" trigger). */
  async getOverflowingItemLabels(): Promise<string[]> {
    const labels: string[] = [];
    for await (const item of this.iterateItems()) {
      if (await item.isOverflowing()) {
        labels.push((await item.getLabel()) ?? '');
      }
    }
    return labels;
  }

  /** The overflow-menu ("+N") trigger's `Menu`, resolved via `[data-overflow-menu]`. See class doc. */
  getOverflowMenu(): MenuDriver {
    return new MenuDriver(this.menuTriggerLocator, this.interactor, this.commutableOption);
  }

  private get menuTriggerLocator(): PartLocator {
    return locatorUtil.append(this.locator, overflowMenuTriggerLocator);
  }

  private iterateItems(): AsyncGenerator<OverflowItemDriver> {
    return childListHelper.iterateMatchingChildren(this, this.locator, overflowItemSelector, OverflowItemDriver);
  }

  get driverName(): string {
    return 'FluentV9OverflowDriver';
  }
}
