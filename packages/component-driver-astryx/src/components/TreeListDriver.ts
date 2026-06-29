import { ComponentDriver, Optional, PartLocator } from '@atomic-testing/core';

import { collectTreeItems, labelElement, toggleButton, TreeItemRef } from '../internal/treeListHelper';

/**
 * Driver for the Astryx TreeList (`@astryxdesign/core/TreeList`).
 *
 * The scene anchors this driver on the root `<div>` (which self-emits
 * `data-testid`); inside is a `<ul role="tree">` of `<li role="treeitem">` rows,
 * with children nested in `<ul role="group">`. Each row carries its state as ARIA
 * on the `<li>` — `aria-expanded` (only when it has children), `aria-selected` — and
 * exposes a label element (`aria-labelledby` → its `<span>`) plus, when expandable, a
 * `"Toggle children"` chevron. The driver walks the tree depth-first (see
 * `treeListHelper`) so labels, counts, and depth all reflect the *visible* rows;
 * `@astryxdesign/core@0.1.1` is not virtualized, so this is faithful in jsdom too.
 *
 * Rows are addressed by their visible label. Astryx exposes no per-row id or
 * depth attribute, so depth is derived from the walk rather than read from the DOM.
 */
export class TreeListDriver extends ComponentDriver {
  private async findByLabel(label: string): Promise<TreeItemRef | null> {
    for (const ref of await collectTreeItems(this.interactor, this.locator)) {
      if ((await this.ownLabel(ref.li)) === label) {
        return ref;
      }
    }
    return null;
  }

  private async ownLabel(li: PartLocator): Promise<Optional<string>> {
    return (await this.interactor.getText(labelElement(li)))?.trim() || undefined;
  }

  /** Number of currently visible rows (expanded branches included, collapsed branches excluded). */
  async getItemCount(): Promise<number> {
    return (await collectTreeItems(this.interactor, this.locator)).length;
  }

  /** Every visible row's own label, in depth-first (visible) order. */
  async getVisibleItemLabels(): Promise<readonly string[]> {
    const labels: string[] = [];
    for (const ref of await collectTreeItems(this.interactor, this.locator)) {
      const label = await this.ownLabel(ref.li);
      if (label != null) {
        labels.push(label);
      }
    }
    return labels;
  }

  /** The depth of the row with the given label (root rows = 0), or `undefined` when absent. */
  async getItemDepth(label: string): Promise<Optional<number>> {
    const ref = await this.findByLabel(label);
    return ref?.depth;
  }

  /** Whether the row with the given label is expanded (`aria-expanded="true"`). `false` when absent or a leaf. */
  async isItemExpanded(label: string): Promise<boolean> {
    const ref = await this.findByLabel(label);
    return ref != null && (await this.interactor.getAttribute(ref.li, 'aria-expanded')) === 'true';
  }

  /** Whether the row with the given label is selected (`aria-selected="true"`). `false` when absent. */
  async isItemSelected(label: string): Promise<boolean> {
    const ref = await this.findByLabel(label);
    return ref != null && (await this.interactor.getAttribute(ref.li, 'aria-selected')) === 'true';
  }

  /**
   * Expand the row with the given label by clicking its chevron, if collapsed.
   * @returns `false` when no such expandable row exists.
   */
  async expandItem(label: string): Promise<boolean> {
    const ref = await this.findByLabel(label);
    if (ref == null || !(await this.interactor.exists(toggleButton(ref.li)))) {
      return false;
    }
    if ((await this.interactor.getAttribute(ref.li, 'aria-expanded')) !== 'true') {
      await this.interactor.click(toggleButton(ref.li));
    }
    return true;
  }

  /**
   * Collapse the row with the given label by clicking its chevron, if expanded.
   * @returns `false` when no such expandable row exists.
   */
  async collapseItem(label: string): Promise<boolean> {
    const ref = await this.findByLabel(label);
    if (ref == null || !(await this.interactor.exists(toggleButton(ref.li)))) {
      return false;
    }
    if ((await this.interactor.getAttribute(ref.li, 'aria-expanded')) === 'true') {
      await this.interactor.click(toggleButton(ref.li));
    }
    return true;
  }

  /**
   * Click the label of the row with the given label.
   * @returns `false` when no such row exists.
   */
  async clickItem(label: string): Promise<boolean> {
    const ref = await this.findByLabel(label);
    if (ref == null) {
      return false;
    }
    await this.interactor.click(labelElement(ref.li));
    return true;
  }

  override get driverName(): string {
    return 'AstryxTreeListDriver';
  }
}
