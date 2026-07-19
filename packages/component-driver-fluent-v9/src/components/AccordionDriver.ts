import {
  byCssClass,
  IComponentDriverOption,
  Interactor,
  ListComponentDriver,
  ListComponentDriverSpecificOption,
  listHelper,
  PartLocator,
} from '@atomic-testing/core';

import { AccordionItemDriver } from './AccordionItemDriver';

/**
 * `AccordionItem`s are Accordion's only children (DOM audit,
 * `@fluentui/react-components@9.74.3`: same-tag `<div class="fui-AccordionItem">`
 * siblings directly under the plain `<div class="fui-Accordion">` root, no
 * interleaved non-item elements), so `ListComponentDriver`'s homogeneous-tag
 * `:nth-of-type` addressing is safe here — unlike `BreadcrumbDriver`, which
 * mixes item/divider `<li>` siblings and needs `childListHelper` instead.
 */
export const defaultAccordionDriverOption: ListComponentDriverSpecificOption<AccordionItemDriver> = {
  itemClass: AccordionItemDriver,
  itemLocator: byCssClass('fui-AccordionItem'),
};

type AccordionDriverOption<ItemT extends AccordionItemDriver> = ListComponentDriverSpecificOption<ItemT> &
  Partial<IComponentDriverOption<any>>;

/**
 * Driver for the Fluent v9 `Accordion` (holding `AccordionItem` children —
 * see {@link AccordionItemDriver} for the header/panel state each item
 * exposes).
 *
 * A {@link ListComponentDriver} over the items, mirroring
 * {@link TabListDriver}'s shape. **`multiple`/`collapsible` mode is not
 * reflected in the DOM at all** (verified by grepping the compiled package
 * for any data attribute/class carrying it) — this driver therefore exposes
 * no `isMultiple()`/`isCollapsible()`; drive/observe expansion per item via
 * {@link AccordionItemDriver} instead, which works identically regardless of
 * mode (each item's own `aria-expanded` is authoritative either way).
 */
export class AccordionDriver<
  ItemT extends AccordionItemDriver = AccordionItemDriver,
> extends ListComponentDriver<ItemT> {
  constructor(locator: PartLocator, interactor: Interactor, option: Partial<AccordionDriverOption<ItemT>> = {}) {
    // Merged in (not a default parameter) for the same reason as TabListDriver:
    // the test engine always passes an option object for a scene part.
    super(locator, interactor, {
      ...defaultAccordionDriverOption,
      ...option,
    } as AccordionDriverOption<ItemT>);
  }

  /** The summary/header label of every item, in DOM order. */
  async getItemSummaries(): Promise<string[]> {
    const summaries: string[] = [];
    for await (const item of listHelper.getListItemIterator(this, this.getItemLocator(), AccordionItemDriver)) {
      summaries.push((await item.getSummary()) ?? '');
    }
    return summaries;
  }

  /** Zero-based indexes of every currently-expanded item, in DOM order (supports `multiple` mode). */
  async getExpandedIndexes(): Promise<number[]> {
    const expanded: number[] = [];
    let index = 0;
    for await (const item of listHelper.getListItemIterator(this, this.getItemLocator(), AccordionItemDriver)) {
      if (await item.isExpanded()) {
        expanded.push(index);
      }
      index++;
    }
    return expanded;
  }

  /** Expand the item at the given zero-based index. @returns `false` when the index is out of range. */
  async expandByIndex(index: number): Promise<boolean> {
    const item = await this.getItemByIndex(index);
    if (item == null) {
      return false;
    }
    await item.expand();
    return true;
  }

  /** Collapse the item at the given zero-based index. @returns `false` when the index is out of range. */
  async collapseByIndex(index: number): Promise<boolean> {
    const item = await this.getItemByIndex(index);
    if (item == null) {
      return false;
    }
    await item.collapse();
    return true;
  }

  override get driverName(): string {
    return 'FluentV9AccordionDriver';
  }
}
