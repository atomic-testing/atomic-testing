import {
  childListHelper,
  ComponentDriver,
  ComponentDriverCtor,
  listHelper,
  Optional,
  PartLocator,
} from '@atomic-testing/core';

/** A list-item driver that exposes a visible label — the key the list matches on. */
export interface LabelledItemDriver extends ComponentDriver {
  getLabel(): Promise<Optional<string>>;
}

/**
 * Shared base for the Astryx drivers that expose a positional list of labelled
 * items — the menu family ({@link AstryxMenuDriver}) and the tab list
 * ({@link TabListDriver}). A subclass declares where the list lives
 * ({@link resolveListContainer}), what an item looks like ({@link itemSelector} +
 * {@link itemDriverClass}), and optionally a {@link groupSelector} to recurse into
 * section wrappers; this base supplies the count / labels / lookup / select surface
 * over them via `childListHelper`'s portable `:nth-child` walk.
 *
 * Matching is by exact visible label (`getLabel`, which trims at the item driver),
 * mirroring the existing `ButtonGroupDriver`.
 */
export abstract class PositionalListDriver<ItemT extends LabelledItemDriver> extends ComponentDriver {
  /** CSS for one item among the container's children (a single selector, no `,` union). */
  protected abstract readonly itemSelector: string;

  /** Driver class constructed for each matched item. */
  protected abstract readonly itemDriverClass: ComponentDriverCtor<ItemT>;

  /** Optional wrapper selector to recurse into (e.g. a `role="group"` section); flat when omitted. */
  protected readonly groupSelector?: string;

  /**
   * The element whose children are the list items, or `null` when it cannot be
   * resolved (e.g. a closed menu with no `aria-controls`).
   */
  protected abstract resolveListContainer(): Promise<PartLocator | null>;

  /** Every item driver, in DOM order. */
  async getItems(): Promise<ItemT[]> {
    const container = await this.resolveListContainer();
    if (container == null) {
      return [];
    }
    return childListHelper.getMatchingChildren(
      this,
      container,
      this.itemSelector,
      this.itemDriverClass,
      this.groupSelector
    );
  }

  /** Number of items in the list. */
  async getItemCount(): Promise<number> {
    const container = await this.resolveListContainer();
    if (container == null) {
      return 0;
    }
    return childListHelper.countMatchingChildren(this.interactor, container, this.itemSelector, this.groupSelector);
  }

  /** Every item's visible label, in DOM order. */
  async getItemLabels(): Promise<readonly string[]> {
    return listHelper.collectItemLabels(await this.getItems());
  }

  /** The item driver whose visible label matches `label`, or `null` when absent. */
  async getItemByLabel(label: string): Promise<ItemT | null> {
    for (const item of await this.getItems()) {
      if ((await item.getLabel()) === label) {
        return item;
      }
    }
    return null;
  }

  /**
   * Click the item whose visible label matches `label`.
   * @returns `false` when no such item exists.
   */
  async selectByLabel(label: string): Promise<boolean> {
    const item = await this.getItemByLabel(label);
    if (item == null) {
      return false;
    }
    await item.click();
    return true;
  }
}
