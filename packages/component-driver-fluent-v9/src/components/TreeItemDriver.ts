import { ComponentDriver, IToggleDriver, listHelper, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

import {
  treeItemChildLocator,
  treeItemLabelLocator,
  treeItemLayoutLocator,
  treeItemNativeInputLocator,
  treeItemSelectorLocator,
  treeSubtreeLocator,
} from '../internal/treeLocators';

const defaultTransitionDuration = 1000;

/**
 * Driver for a single Fluent v9 `TreeItem` (a child of `Tree` — see
 * {@link TreeDriver} — or of another `TreeItem`, arbitrarily nested).
 *
 * DOM audit (@fluentui/react-tree@9.16.3, rendered `TreeItem` + `TreeItemLayout`
 * under jsdom): the item's OWN root is a real `<div role="treeitem"
 * class="fui-TreeItem" aria-level="N">` — no wrapper to look past, like
 * `NavItemDriver`. Its direct children are `[.fui-TreeItemLayout, .fui-Tree
 * (role="group")?]`: the layout (label + optional expand chevron + optional
 * selection control) always first, and — ONLY for a branch with mounted
 * children — a nested `.fui-Tree` holding this item's own children as
 * siblings of each other, one level down. Because that nested subtree is a
 * DOM DESCENDANT of this item's own root, {@link getLabel} deliberately reads
 * `.fui-TreeItemLayout__main` rather than the inherited whole-root
 * `getText()` — for an EXPANDED branch, `getText()` would concatenate this
 * item's own label with every visible descendant's label too (the same class
 * of over-inclusive read `CompoundButtonDriver`/`MessageBarDriver` document
 * elsewhere in this package). The same hazard applies to `click()` (see
 * below).
 *
 * **Leaf vs. branch is a consumer-declared prop (`itemType`), not something
 * Fluent infers from whether children were passed** — verified against
 * `useTreeItem_unstable`'s source (`itemType = 'leaf'` default) and DOM
 * (`aria-expanded` is emitted if-and-only-if `itemType="branch"`, entirely
 * ABSENT — not `"false"` — for a leaf). {@link isBranch}/{@link isLeaf} read
 * that attribute's PRESENCE, matching this driver's `expand()`/`collapse()`
 * no-op-on-leaf guard to `AccordionItemDriver.click()`'s disabled-guard
 * shape.
 *
 * **`disabled` has zero DOM reflection** — grepped the compiled package's
 * type declarations (`TreeItemProps`): there is no `disabled` prop at all
 * (`TreeItemProps` is `ComponentProps<Partial<TreeItemSlots>>` — the root
 * `<div>`'s own native attributes — plus `itemType`/`value`/`open`/
 * `onOpenChange`/`parentValue` only). Same class of gap as `TagDriver`'s
 * `disabled`-has-no-DOM-reflection caveat; this driver does not implement
 * `IDisableableDriver`.
 *
 * **Selection is reflected on THIS item's own root, per `selectionMode`** —
 * `aria-selected` (`single`) or `aria-checked` (`multiselect`), never both;
 * neither attribute is present at all when the tree's `selectionMode` is the
 * default `'none'` (verified: no selector control renders either). Fluent
 * also renders a real, `aria-hidden` native `<input type="radio"|"checkbox"
 * class="fui-TreeItemLayout__selector">` for the visual indicator, but the
 * ACCESSIBLE state lives on the treeitem root, not that hidden input — same
 * split `RadioDriver`/`CheckboxDriver` don't need to make, because THEIR root
 * already IS the native input.
 *
 * **Selecting an item does NOT also toggle its expansion** — verified
 * against `useTreeItem_unstable`'s `handleClick`: a click whose target is
 * (or is inside) the selection control returns immediately, before the
 * open/navigate dispatch that a normal row click triggers. This does NOT
 * reproduce `SimpleTreeViewDriver`'s (MUI-X) documented caveat that
 * "selecting an expandable item also toggles expansion" — Fluent's Tree
 * keeps the two concerns on genuinely separate click targets, so
 * {@link select}/{@link setSelected} click the selector control specifically
 * (not the row) and leave {@link isExpanded} untouched.
 *
 * **Value reflection**: unlike `Option.value` elsewhere in this package
 * (Combobox/Dropdown), `TreeItem`'s `value` DOES reflect to the DOM, via
 * `data-fui-tree-item-value` — see {@link getValue}. This driver still
 * favors positional addressing as its primary API (mirroring `NavDriver`'s
 * shape), since an app that never supplies `value` gets an internally
 * generated, run-unstable id there instead.
 *
 * **Selection is fully controlled upstream — a scene under test MUST wire
 * `checkedItems`/`onCheckedChange` on its own `Tree` for {@link select}/
 * {@link setSelected} to have any visible effect.** Source audit of
 * `@fluentui/react-tree@9.16.3`'s `useTree`/`useNestedControllableCheckedItems`:
 * unlike `openItems` (which has a genuine uncontrolled fallback via
 * `useControllableOpenItems`), `checkedItems` is derived ONLY from the
 * `checkedItems` prop, with no internal state and no `defaultCheckedItems` on
 * the base `<Tree>` (`defaultCheckedItems` exists only on the separate,
 * out-of-scope `HeadlessFlatTreeOptions`/`FlatTree` API) — confirmed by
 * instrumenting a real render: a bare `selectionMode="single"`/`"multiselect"`
 * `Tree` with no `checkedItems` wired never fires `onCheckedChange` and stays
 * silently unselectable regardless of what's clicked or key-pressed. This is
 * an upstream Fluent contract, not a driver limitation — see this package's
 * `Tree.examples.tsx` for the required controlled-state pattern.
 */
export class TreeItemDriver extends ComponentDriver<{}> implements IToggleDriver {
  private get layoutLocator(): PartLocator {
    return locatorUtil.append(this.locator, treeItemLayoutLocator);
  }

  private get labelLocator(): PartLocator {
    return locatorUtil.append(this.layoutLocator, treeItemLabelLocator);
  }

  private get selectorInputLocator(): PartLocator {
    return locatorUtil.append(this.layoutLocator, treeItemSelectorLocator, treeItemNativeInputLocator);
  }

  private get subtreeLocator(): PartLocator {
    return locatorUtil.append(this.locator, treeSubtreeLocator);
  }

  private get childItemLocatorBase(): PartLocator {
    return locatorUtil.append(this.subtreeLocator, treeItemChildLocator);
  }

  /** This item's own visible label, trimmed — see class doc for why this is scoped past any nested subtree. */
  async getLabel(): Promise<Optional<string>> {
    const text = await this.interactor.getText(this.labelLocator);
    return text?.trim();
  }

  /** The nesting depth (1-based), read from `aria-level` on this item's own root. */
  async getLevel(): Promise<number> {
    const level = await this.interactor.getAttribute(this.locator, 'aria-level');
    return level ? Number(level) : 1;
  }

  /**
   * Whether this item can expand/collapse (`itemType="branch"`, read via
   * `aria-expanded`'s PRESENCE — see class doc). A leaf item always reports
   * `false`.
   */
  async isBranch(): Promise<boolean> {
    return this.interactor.hasAttribute(this.locator, 'aria-expanded');
  }

  /** The inverse of {@link isBranch}. */
  async isLeaf(): Promise<boolean> {
    return !(await this.isBranch());
  }

  /** Whether a branch item is currently expanded. Always `false` for a leaf (no `aria-expanded` to read). */
  async isExpanded(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-expanded')) === 'true';
  }

  /** Expand this item if it is a collapsed branch — a no-op on a leaf or an already-expanded branch. */
  async expand(timeoutMs: number = defaultTransitionDuration): Promise<void> {
    await this.setExpanded(true, timeoutMs);
  }

  /** Collapse this item if it is an expanded branch — a no-op on a leaf or an already-collapsed branch. */
  async collapse(timeoutMs: number = defaultTransitionDuration): Promise<void> {
    await this.setExpanded(false, timeoutMs);
  }

  /**
   * Whether this item is selected — `aria-selected` (`selectionMode="single"`)
   * or `aria-checked` (`"multiselect"`); always `false` under `"none"`, where
   * neither attribute is rendered.
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
   * native) selection control directly — see class doc for why the row
   * itself is not the click target. Deselecting a `single`-mode item is
   * rejected (native radio semantics: nothing to click that unchecks a
   * radio directly), the same contract as `RadioDriver.setSelected(false)`.
   * A no-op if the item already has the requested state.
   */
  async setSelected(selected: boolean): Promise<void> {
    if ((await this.isSelected()) === selected) {
      return;
    }
    if (!selected && (await this.interactor.getAttribute(this.locator, 'aria-checked')) == null) {
      throw new Error(
        'Cannot deselect a single-select Tree item directly (native radio semantics); select a different item instead.'
      );
    }
    await this.interactor.click(this.selectorInputLocator);
  }

  /** Convenience for `setSelected(true)`. */
  async select(): Promise<void> {
    await this.setSelected(true);
  }

  /**
   * The value Fluent stamped for this item via `data-fui-tree-item-value` —
   * see class doc's "Value reflection" note for the caveat when the scene
   * does not supply its own `value`.
   */
  async getValue(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-fui-tree-item-value');
  }

  /**
   * The number of direct children in this item's own subtree — `0` for a
   * leaf, and `0` while a branch is collapsed (its subtree is fully
   * unmounted; see class doc). Deliberately does NOT auto-expand: unlike
   * `NavCategoryItemDriver.getSubItemCount()`, a read here never mutates UI
   * state — call {@link expand} first to reach a branch's real count
   * (command/query separation; `expand()` is already public, so nothing is
   * lost by requiring it explicitly).
   */
  async getChildItemCount(): Promise<number> {
    return listHelper.getListItemCount(this, this.childItemLocatorBase);
  }

  /** The child item at the given zero-based index, or `null` when out of range or not currently mounted. */
  async getChildItemByIndex(index: number): Promise<TreeItemDriver | null> {
    return listHelper.getListItemByIndex(this, this.childItemLocatorBase, index, TreeItemDriver);
  }

  /** Every direct child of this item, in DOM order — see {@link getChildItemCount} for the collapsed/leaf caveat. */
  async getChildItems(): Promise<TreeItemDriver[]> {
    const items: TreeItemDriver[] = [];
    for await (const item of listHelper.getListItemIterator(this, this.childItemLocatorBase, TreeItemDriver)) {
      items.push(item);
    }
    return items;
  }

  /**
   * Click this item's own label row — scoped to `.fui-TreeItemLayout__main`,
   * NOT the inherited `this.locator`, because an expanded branch's root
   * bounding box spans its rendered subtree too; a coordinate-based click
   * (Playwright) on the raw root could land on a descendant item instead of
   * this one. Toggles expansion as a side effect for a branch item (Fluent's
   * own behavior — any row click besides the selection control does this;
   * see class doc), which {@link expand}/{@link collapse} rely on.
   */
  override async click(): Promise<void> {
    await this.interactor.click(this.labelLocator);
  }

  /**
   * Waits for the subtree wrapper itself (not merely `aria-expanded`) to
   * settle — verified against real Chromium: `aria-expanded` flips
   * SYNCHRONOUSLY on click, but the subtree's mount/unmount runs behind
   * Fluent's exit-motion (same `unmountOnExit` shape as `AccordionPanel`),
   * so a probe on `aria-expanded` alone can resolve before the DOM catches
   * up — a `getChildItemCount()` read immediately after a real-browser
   * `collapse()` observed the still-mounted children. Probing subtree
   * presence directly waits out that animation instead of racing it.
   */
  private async setExpanded(expanded: boolean, timeoutMs: number): Promise<void> {
    if (!(await this.isBranch()) || (await this.isExpanded()) === expanded) {
      return;
    }
    await this.click();
    await this.interactor.waitUntil({
      probeFn: () => this.interactor.exists(this.subtreeLocator),
      terminateCondition: expanded,
      timeoutMs,
    });
  }

  get driverName(): string {
    return 'FluentV9TreeItemDriver';
  }
}
