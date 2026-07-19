import { byCssClass, childListHelper, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

import { BreadcrumbItemNotFoundError } from '../errors/BreadcrumbItemNotFoundError';
import { BreadcrumbItemDriver } from './BreadcrumbItemDriver';

const listLocator = byCssClass('fui-Breadcrumb__list');
const itemSelector = '.fui-BreadcrumbItem';

/**
 * Driver for the Fluent v9 `Breadcrumb` (holding `BreadcrumbItem` children,
 * each wrapping a `BreadcrumbButton` — see {@link BreadcrumbItemDriver}).
 *
 * DOM audit (@fluentui/react-components@9.74.3): the scene's own locator
 * lands directly on `Breadcrumb`'s own root — a plain, never-portalled
 * `<nav aria-label="breadcrumb" class="fui-Breadcrumb">` — no re-root needed.
 * Its items live inside a child `<ol role="list" class="fui-Breadcrumb__list">`,
 * interleaved with decorative `<li aria-hidden="true" class="fui-BreadcrumbDivider">`
 * separators — both item and divider are `<li>` siblings, which breaks
 * `ListComponentDriver`'s homogeneous-tag `:nth-of-type` addressing (same
 * mixed-sibling shape `TagGroupDriver` hits), so item enumeration walks
 * `childListHelper`'s `:nth-child` + class-selector filter instead, scoped to
 * `.fui-BreadcrumbItem`.
 *
 * `BreadcrumbDivider` has no dedicated driver: it is purely decorative
 * (`aria-hidden`, no interactive state), so — per this wave's rule that a
 * driver models independently INTERACTIVE/addressable units, folding purely
 * structural wrappers into their interactive sibling — it is out of scope
 * here, the same way `AccordionHeader`/`AccordionPanel` fold into
 * `AccordionItemDriver` rather than getting their own classes.
 */
export class BreadcrumbDriver extends ComponentDriver<{}> {
  private get listLocator(): PartLocator {
    return locatorUtil.append(this.locator, listLocator);
  }

  /** The number of `BreadcrumbItem`s (dividers excluded). */
  async getItemCount(): Promise<number> {
    return childListHelper.countMatchingChildren(this.interactor, this.listLocator, itemSelector);
  }

  /** The visible label of every item, in DOM order. */
  async getItemLabels(): Promise<Optional<string>[]> {
    const labels: Optional<string>[] = [];
    for await (const item of this.iterateItems()) {
      labels.push(await item.getLabel());
    }
    return labels;
  }

  /** The item at the given zero-based index, or `null` when out of range. */
  async getItemByIndex(index: number): Promise<BreadcrumbItemDriver | null> {
    let position = 0;
    for await (const item of this.iterateItems()) {
      if (position === index) {
        return item;
      }
      position++;
    }
    return null;
  }

  /** The first item whose visible label equals `label`, or `null` when absent. */
  async getItemByLabel(label: string): Promise<BreadcrumbItemDriver | null> {
    for await (const item of this.iterateItems()) {
      if ((await item.getLabel()) === label) {
        return item;
      }
    }
    return null;
  }

  /** The item marked as the current page (`aria-current="page"`), or `null` when none is. */
  async getCurrentItem(): Promise<BreadcrumbItemDriver | null> {
    for await (const item of this.iterateItems()) {
      if (await item.isCurrent()) {
        return item;
      }
    }
    return null;
  }

  /**
   * Click the item whose visible label matches `label`.
   * @throws {BreadcrumbItemNotFoundError} when no item matches.
   */
  async selectByLabel(label: string): Promise<void> {
    const item = await this.getItemByLabel(label);
    if (item == null) {
      throw new BreadcrumbItemNotFoundError(label, this);
    }
    await item.click();
  }

  private iterateItems(): AsyncGenerator<BreadcrumbItemDriver> {
    return childListHelper.iterateMatchingChildren(this, this.listLocator, itemSelector, BreadcrumbItemDriver);
  }

  get driverName(): string {
    return 'FluentV9BreadcrumbDriver';
  }
}
