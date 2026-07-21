import {
  IComponentDriverOption,
  Interactor,
  ListComponentDriver,
  ListComponentDriverSpecificOption,
  PartLocator,
} from '@atomic-testing/core';

import { treeItemChildLocator } from '../internal/treeLocators';
import { FlatTreeItemDriver } from './FlatTreeItemDriver';

/**
 * `FlatTreeItem`s are `FlatTree`'s only children, and — unlike nested
 * `Tree`/`TreeItem` — EVERY item at EVERY level, DOM audit
 * (`@fluentui/react-tree@9.16.3`, jsdom render of a real
 * `useHeadlessFlatTree_unstable` fixture): a `FlatTree` never nests a
 * `.fui-Tree`/`.fui-TreeItem` subtree inside an item the way `Tree` does —
 * every currently-visible `.fui-TreeItem`, regardless of `aria-level`, is a
 * same-tag `<div>` DIRECT CHILD of the single root `<div class="fui-FlatTree"
 * role="tree">`. So the plain `'Child'` scope this constant already uses for
 * `Tree`'s one-level walk (see `treeLocators.ts`) also happens to be exactly
 * right here — no per-level recursion needed, since there IS no second
 * level in the DOM.
 */
export const defaultFlatTreeDriverOption: ListComponentDriverSpecificOption<FlatTreeItemDriver> = {
  itemClass: FlatTreeItemDriver,
  itemLocator: treeItemChildLocator,
};

type FlatTreeDriverOption<ItemT extends FlatTreeItemDriver> = ListComponentDriverSpecificOption<ItemT> &
  Partial<IComponentDriverOption<any>>;

/**
 * Driver for the Fluent v9 `FlatTree` root — the virtualization-friendly,
 * flattened sibling of `Tree` (see {@link TreeDriver}), built on
 * `useHeadlessFlatTree_unstable`. See {@link FlatTreeItemDriver} for the
 * full DOM-audit rationale of why this driver's shape differs from
 * `TreeDriver`'s: there is no nesting to recurse into, so
 * `getItemCount`/`getItemByIndex`/`getItems`/`getItemByLabel` (all
 * inherited from `ListComponentDriver`) already answer "every item, at any
 * level" correctly with no override needed — `Tree`'s "top-level items
 * only" restriction doesn't apply because `FlatTree` has no other level to
 * exclude.
 *
 * `selectionMode`'s DOM reflection (`aria-multiselectable`) is identical to
 * `Tree`'s — see {@link TreeDriver.isMultiSelect}'s doc for the same
 * "answers is-multiselect only, not the full three-way mode" caveat.
 */
export class FlatTreeDriver<ItemT extends FlatTreeItemDriver = FlatTreeItemDriver> extends ListComponentDriver<ItemT> {
  constructor(locator: PartLocator, interactor: Interactor, option: Partial<FlatTreeDriverOption<ItemT>> = {}) {
    // Merged in (not a default parameter) for the same reason as TreeDriver/
    // AccordionDriver/TabListDriver: the test engine always passes an
    // option object for a scene part.
    super(locator, interactor, {
      ...defaultFlatTreeDriverOption,
      ...option,
    } as FlatTreeDriverOption<ItemT>);
  }

  /** Whether the tree allows selecting more than one item at once (`aria-multiselectable` on the root — see class doc). */
  async isMultiSelect(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-multiselectable')) === 'true';
  }

  /**
   * The first item (at ANY level) whose Fluent-stamped `value` (see
   * {@link FlatTreeItemDriver.getValue}) matches, or `null` when absent —
   * the natural lookup key for a flat tree: the inherited `getItemByLabel`
   * only matches by visible label text, which a real flat dataset (the
   * scenario `FlatTree` exists for) commonly repeats across branches, while
   * `value` is the app's own stable per-item identifier.
   */
  async getItemByValue<ItemClass extends ItemT = ItemT>(value: string): Promise<ItemClass | null> {
    for (const item of await this.getItems<ItemClass>()) {
      if ((await item.getValue()) === value) {
        return item;
      }
    }
    return null;
  }

  override get driverName(): string {
    return 'FluentV9FlatTreeDriver';
  }
}
