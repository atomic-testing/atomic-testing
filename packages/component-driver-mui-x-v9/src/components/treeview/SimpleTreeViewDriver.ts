import {
  byCssSelector,
  byRole,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  locatorUtil,
  Optional,
  PartLocator,
} from '@atomic-testing/core';

// MUI X Tree View renders an accessible tree: a `[role=tree]` container whose items are
// `<li role="treeitem">` carrying `aria-expanded` (expandable items only) and `aria-selected`
// (when selection is enabled). Each item's own label lives in `.MuiTreeItem-label` inside its
// `.MuiTreeItem-content`; child items live in a nested `<ul>` that is only rendered while the
// parent is expanded (collapsed branches are absent from the DOM).
//
// Items are identified by the app-assigned `itemId`, which MUI emits as the suffix of the
// element `id` (`mui-tree-view-<n>-<itemId>`). There is no dedicated `data-itemid`, so this
// driver matches on the `id` suffix; the leading `-` keeps `apple` from matching `crabapple`.
//
// Tree items are NESTED `<li>`s, so the `:nth-of-type` list iteration used for flat lists
// (grid cells, menu items) does not apply here — counts/ids are read via the portable
// "all matching elements" form of `getAttribute`.
const treeIdPrefix = /^mui-tree-view-\d+-/;

function itemLocator(itemId: string): PartLocator {
  return byCssSelector(`[role=treeitem][id$="-${itemId}"]`);
}

function itemContentLocator(itemId: string): PartLocator {
  // The clickable content row; clicking it toggles expansion for items that have children.
  return byCssSelector(`[role=treeitem][id$="-${itemId}"] > .MuiTreeItem-content`);
}

function itemLabelLocator(itemId: string): PartLocator {
  // Scope to the item's OWN label (direct content), not descendant children's labels.
  return byCssSelector(`[role=treeitem][id$="-${itemId}"] > .MuiTreeItem-content .MuiTreeItem-label`);
}

/**
 * Driver for the Material UI X v9 SimpleTreeView / RichTreeView components.
 * @see https://mui.com/x/react-tree-view/
 */
export class SimpleTreeViewDriver extends ComponentDriver {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: {},
    });
  }

  /**
   * The app-assigned `itemId`s of every currently rendered tree item, in document order.
   * Because collapsed branches are not in the DOM, this reflects only the visible items.
   */
  async getItemIds(): Promise<string[]> {
    const ids = await this.interactor.getAttribute(locatorUtil.append(this.locator, byRole('treeitem')), 'id', true);
    return ids.map(id => id.replace(treeIdPrefix, ''));
  }

  /**
   * The number of tree items currently rendered (visible items only).
   */
  async getItemCount(): Promise<number> {
    return (await this.getItemIds()).length;
  }

  /**
   * Whether the item identified by `itemId` is currently rendered in the tree.
   */
  async itemExists(itemId: string): Promise<boolean> {
    return this.interactor.exists(locatorUtil.append(this.locator, itemLocator(itemId)));
  }

  /**
   * The label text of a specific item, or `undefined` when the item is not rendered.
   */
  async getItemLabel(itemId: string): Promise<Optional<string>> {
    const locator = locatorUtil.append(this.locator, itemLabelLocator(itemId));
    if (!(await this.interactor.exists(locator))) {
      return undefined;
    }
    return this.interactor.getText(locator);
  }

  /**
   * Whether an expandable item is expanded. Reads `aria-expanded`; returns false for leaf
   * items (which carry no `aria-expanded`) or items that are not rendered.
   */
  async isExpanded(itemId: string): Promise<boolean> {
    const expanded = await this.interactor.getAttribute(
      locatorUtil.append(this.locator, itemLocator(itemId)),
      'aria-expanded'
    );
    return expanded === 'true';
  }

  /**
   * Whether an item is selected. Reads `aria-selected`; only meaningful when the tree has
   * selection enabled.
   */
  async isSelected(itemId: string): Promise<boolean> {
    const selected = await this.interactor.getAttribute(
      locatorUtil.append(this.locator, itemLocator(itemId)),
      'aria-selected'
    );
    return selected === 'true';
  }

  /**
   * Expand the item if it is collapsed; no-op when already expanded. After expansion the
   * item's children become available in the DOM.
   */
  async expandItem(itemId: string): Promise<void> {
    if (!(await this.isExpanded(itemId))) {
      await this.interactor.click(locatorUtil.append(this.locator, itemContentLocator(itemId)));
    }
  }

  /**
   * Collapse the item if it is expanded; no-op when already collapsed.
   */
  async collapseItem(itemId: string): Promise<void> {
    if (await this.isExpanded(itemId)) {
      await this.interactor.click(locatorUtil.append(this.locator, itemContentLocator(itemId)));
    }
  }

  override get driverName(): string {
    return 'MuiV9SimpleTreeViewDriver';
  }
}
