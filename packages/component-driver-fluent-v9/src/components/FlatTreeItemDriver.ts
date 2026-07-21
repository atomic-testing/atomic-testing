import { ComponentDriver, IToggleDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

import {
  treeItemLabelLocator,
  treeItemLayoutLocator,
  treeItemNativeInputLocator,
  treeItemSelectorLocator,
} from '../internal/treeLocators';

/**
 * Driver for a single item of a Fluent v9 `FlatTree` (see {@link FlatTreeDriver}
 * for the root — every item, at any nesting level, is addressed through it as
 * one flat list; there is no per-item recursive `getChildItem*` API here,
 * unlike {@link TreeItemDriver}, for the structural reason explained below).
 *
 * **`FlatTreeItem` is a bare re-export of `TreeItem`** — DOM audit
 * (`@fluentui/react-tree@9.16.3`'s compiled source: `export const FlatTreeItem
 * = TreeItem;`) confirms it renders the IDENTICAL `<div role="treeitem"
 * class="fui-TreeItem">` + `.fui-TreeItemLayout` shape {@link TreeItemDriver}
 * documents, which is why this driver shares its locators
 * (`internal/treeLocators.ts`) and most of its read/selection logic with that
 * driver. The difference is structural, not stylistic: a `FlatTree` never
 * nests — DOM audit (jsdom render of a real `useHeadlessFlatTree_unstable`
 * fixture) confirms every visible item, regardless of `aria-level`, is a
 * DIRECT CHILD of the single root `<div class="fui-FlatTree" role="tree">`;
 * there is no per-item `.fui-Tree` subtree wrapper the way a nested
 * `TreeItem` has. A collapsed branch's descendants are simply absent
 * siblings, not an unmounted descendant of the collapsed item itself.
 *
 * **Hierarchy is knowable only from `aria-level`/`aria-posinset`/
 * `aria-setsize`, never from a DOM parent/child relationship.** Fluent's
 * `useHeadlessFlatTree_unstable` computes a `parentValue` for every item (and
 * warns in dev mode if an app-supplied item omits it), but source audit of
 * `useTreeItem_unstable` shows `parentValue` is consumed purely as a React
 * prop for internal click/navigation bookkeeping — it is never spread onto
 * the rendered `<div>` (`getIntrinsicElementProps`/`getNativeElementProps`
 * filters any prop that is neither a recognized native attribute nor
 * `aria-`/`data-`-prefixed, and `parentValue` is none of those; confirmed by
 * the jsdom DOM audit finding no such attribute anywhere). Consequently this
 * driver — and {@link FlatTreeDriver} — expose no descendant-navigation
 * method at all: a `FlatTreeItem`'s "children" are just OTHER items
 * elsewhere in the same flat list with a higher `aria-level`, which is a
 * DOM-order-plus-level INFERENCE this driver deliberately does not encode as
 * an API (nothing in the DOM contract guarantees it), matching
 * `component-driver-mui-x-v9`'s `SimpleTreeViewDriver` precedent, which
 * likewise exposes no descendant-navigation API for its own non-nesting flat
 * tree DOM. Callers who need the hierarchy read `getLevel`/`getPosInSet`/
 * `getSetSize` per item themselves.
 *
 * **`expand`/`collapse` need no exit-motion wait**, unlike
 * {@link TreeItemDriver}: there is no `Collapse`-wrapped subtree to wait
 * out — hiding a branch's descendants is the app's own synchronous
 * re-render (`useHeadlessFlatTree_unstable`'s `items()` recomputing which
 * values are currently visible), so `aria-expanded` and the resulting
 * sibling set change atomically within the same click.
 *
 * **Selection/leaf/branch/value semantics are otherwise identical to
 * {@link TreeItemDriver}** (same `checkedItems`/`onCheckedChange` upstream
 * contract, same `aria-selected`/`aria-checked` split by `selectionMode`,
 * same `data-fui-tree-item-value` reflection) — see that class's doc for the
 * full rationale, which applies here unchanged since both drivers are
 * reading the same underlying `useTreeItem_unstable` output.
 */
export class FlatTreeItemDriver extends ComponentDriver<{}> implements IToggleDriver {
  private get layoutLocator(): PartLocator {
    return locatorUtil.append(this.locator, treeItemLayoutLocator);
  }

  private get labelLocator(): PartLocator {
    return locatorUtil.append(this.layoutLocator, treeItemLabelLocator);
  }

  private get selectorInputLocator(): PartLocator {
    return locatorUtil.append(this.layoutLocator, treeItemSelectorLocator, treeItemNativeInputLocator);
  }

  /** This item's own visible label, trimmed. */
  async getLabel(): Promise<Optional<string>> {
    const text = await this.interactor.getText(this.labelLocator);
    return text?.trim();
  }

  /** The nesting depth (1-based), read from the required `aria-level` (see class doc). */
  async getLevel(): Promise<number> {
    const level = await this.interactor.getAttribute(this.locator, 'aria-level');
    return level == null ? 1 : Number(level);
  }

  /** This item's 1-based position among its siblings at its own level, read from the required `aria-posinset` (see class doc). */
  async getPosInSet(): Promise<number> {
    const posInSet = await this.interactor.getAttribute(this.locator, 'aria-posinset');
    return posInSet == null ? 1 : Number(posInSet);
  }

  /** The number of siblings at this item's own level, read from the required `aria-setsize` (see class doc). */
  async getSetSize(): Promise<number> {
    const setSize = await this.interactor.getAttribute(this.locator, 'aria-setsize');
    return setSize == null ? 1 : Number(setSize);
  }

  /** Whether this item can expand/collapse (`itemType="branch"`, read via `aria-expanded`'s presence). A leaf item always reports `false`. */
  async isBranch(): Promise<boolean> {
    return this.interactor.hasAttribute(this.locator, 'aria-expanded');
  }

  /** The inverse of {@link isBranch}. */
  async isLeaf(): Promise<boolean> {
    return !(await this.isBranch());
  }

  /** Whether a branch item is currently expanded. Always `false` for a leaf. */
  async isExpanded(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-expanded')) === 'true';
  }

  /** Expand this item if it is a collapsed branch — a no-op on a leaf or an already-expanded branch. */
  async expand(): Promise<void> {
    await this.setExpanded(true);
  }

  /** Collapse this item if it is an expanded branch — a no-op on a leaf or an already-collapsed branch. */
  async collapse(): Promise<void> {
    await this.setExpanded(false);
  }

  /**
   * Whether this item is selected — `aria-selected` (`selectionMode="single"`)
   * or `aria-checked` (`"multiselect"`); always `false` under `"none"`.
   */
  async isSelected(): Promise<boolean> {
    const [selected, checked] = await Promise.all([
      this.interactor.getAttribute(this.locator, 'aria-selected'),
      this.interactor.getAttribute(this.locator, 'aria-checked'),
    ]);
    return selected === 'true' || checked === 'true';
  }

  /**
   * Select or deselect this item by clicking its (visually hidden, but real
   * native) selection control — see {@link TreeItemDriver.setSelected} for
   * the identical rationale. Deselecting a `single`-mode item is rejected
   * (native radio semantics). A no-op if the item already has the requested
   * state.
   */
  async setSelected(selected: boolean): Promise<void> {
    if ((await this.isSelected()) === selected) {
      return;
    }
    if (!selected && (await this.interactor.getAttribute(this.locator, 'aria-checked')) == null) {
      throw new Error(
        'Cannot deselect a single-select FlatTree item directly (native radio semantics); select a different item instead.'
      );
    }
    await this.interactor.click(this.selectorInputLocator);
  }

  /** Convenience for `setSelected(true)`. */
  async select(): Promise<void> {
    await this.setSelected(true);
  }

  /** The value Fluent stamped for this item via `data-fui-tree-item-value`. */
  async getValue(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-fui-tree-item-value');
  }

  /**
   * Click this item's own label row — scoped to `.fui-TreeItemLayout__main`
   * rather than the inherited `this.locator`, so a click never lands on the
   * expand chevron or selection control that also live under this item's
   * root (see {@link TreeItemDriver.click} for the same scoping). Toggles
   * expansion as a side effect for a branch item, which {@link expand}/
   * {@link collapse} rely on.
   */
  override async click(): Promise<void> {
    await this.interactor.click(this.labelLocator);
  }

  private async setExpanded(expanded: boolean): Promise<void> {
    if (!(await this.isBranch()) || (await this.isExpanded()) === expanded) {
      return;
    }
    await this.click();
  }

  get driverName(): string {
    return 'FluentV9FlatTreeItemDriver';
  }
}
