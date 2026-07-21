import {
  IComponentDriverOption,
  Interactor,
  ListComponentDriver,
  ListComponentDriverSpecificOption,
  PartLocator,
} from '@atomic-testing/core';

import { treeItemChildLocator } from '../internal/treeLocators';
import { TreeItemDriver } from './TreeItemDriver';

/**
 * `TreeItem`s are `Tree`'s only children (DOM audit,
 * @fluentui/react-tree@9.16.3: same-tag `<div class="fui-TreeItem">`
 * siblings directly under the root `<div class="fui-Tree" role="tree">`, no
 * interleaved non-item elements), restricted to `'Child'` — see
 * `internal/treeLocators.ts` for why `'Descendant'` would incorrectly
 * flatten nested items into this count too.
 */
export const defaultTreeDriverOption: ListComponentDriverSpecificOption<TreeItemDriver> = {
  itemClass: TreeItemDriver,
  itemLocator: treeItemChildLocator,
};

type TreeDriverOption<ItemT extends TreeItemDriver> = ListComponentDriverSpecificOption<ItemT> &
  Partial<IComponentDriverOption<any>>;

/**
 * Driver for the Fluent v9 `Tree` root (nested `TreeItem`s — see
 * {@link TreeItemDriver} for expand/collapse, selection, and per-item
 * recursive child access; the `FlatTree`/`FlatTreeItem` performance variant —
 * built on `useHeadlessFlatTree_unstable`, still `_unstable`-suffixed as of
 * `@fluentui/react-tree@9.16.3` — is a structurally different, non-nesting
 * DOM and has its OWN driver pair, `FlatTreeDriver`/`FlatTreeItemDriver`; see
 * that pair's class docs for why their shape differs from this one's).
 *
 * A {@link ListComponentDriver} over this level's TOP-LEVEL items only —
 * `getItemCount`/`getItems`/`getItemByIndex` (inherited) never descend into
 * a nested subtree. This is a deliberate departure from `NavDriverBase`'s
 * shape, which flattens its ENTIRE (differently-structured) item tree with
 * `childListHelper`'s recursive `groupSelector`: `Nav`'s nesting is a
 * special-cased category/sub-item-group pairing with no uniform shape at
 * each depth, so flattening it into one queryable list is the only
 * ergonomic option. `Tree`'s nesting, in contrast, is perfectly
 * self-similar — every level (the root `Tree`, and every `TreeItem`'s own
 * nested subtree) is an identical "list of `.fui-TreeItem` siblings" shape —
 * so this driver models it recursively instead: `TreeDriver` walks ONE
 * level (this component's own top-level items) exactly like
 * `AccordionDriver` walks its flat item list, and `TreeItemDriver` exposes
 * the SAME one-level walk one level down via `getChildItems()`/
 * `getChildItemCount()`/`getChildItemByIndex()` (see its class doc). A
 * caller walks arbitrarily deep by recursing through those, the same way a
 * consumer of `NavCategoryItemDriver.getSubItemByLabel` walks `Nav`'s
 * nesting — just without this driver doing the flattening on the caller's
 * behalf, since a flattened Tree read couldn't distinguish which level an
 * item belongs to the way `Nav`'s (much shallower, two-level) shape can.
 *
 * `selectionMode` itself has one useful DOM reflection at the root:
 * `aria-multiselectable`, present (`"true"`) only for `"multiselect"` —
 * absent (not `"false"`) for both `"single"` and the default `"none"`, so it
 * only ever answers "is this multiselect," not the full three-way mode; see
 * {@link isMultiSelect}.
 */
export class TreeDriver<ItemT extends TreeItemDriver = TreeItemDriver> extends ListComponentDriver<ItemT> {
  constructor(locator: PartLocator, interactor: Interactor, option: Partial<TreeDriverOption<ItemT>> = {}) {
    // Merged in (not a default parameter) for the same reason as
    // AccordionDriver/TabListDriver: the test engine always passes an
    // option object for a scene part.
    super(locator, interactor, {
      ...defaultTreeDriverOption,
      ...option,
    } as TreeDriverOption<ItemT>);
  }

  /** Whether the tree allows selecting more than one item at once (`aria-multiselectable` on the root — see class doc). */
  async isMultiSelect(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-multiselectable')) === 'true';
  }

  override get driverName(): string {
    return 'FluentV9TreeDriver';
  }
}
