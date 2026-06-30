import { byCssSelector, ComponentDriverCtor, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

import { PositionalListDriver } from '../internal/PositionalListDriver';
import { BreadcrumbItemDriver } from './BreadcrumbItemDriver';

/**
 * Driver for the Astryx Breadcrumbs (`@astryxdesign/core/Breadcrumbs`).
 *
 * Breadcrumbs is a `<nav aria-label="Breadcrumb" class="astryx-breadcrumbs">` that
 * forwards `data-testid` and wraps an `<ol>` of `<li class="astryx-breadcrumb-item">`
 * crumbs (the separators are `aria-hidden` spans *inside* each crumb, not extra
 * `<li>`s). The crumbs are the `<ol>`'s direct children, driven by
 * {@link BreadcrumbItemDriver}; the count/labels surface comes from
 * {@link PositionalListDriver}'s `:nth-child` walk, and the per-crumb label/href/
 * current logic lives in the item driver — so a crumb with no link and no inner
 * `aria-current` (Astryx's auto-current last crumb marks the `<li>` itself) is read
 * faithfully instead of being silently dropped. The whole trail is rendered in the
 * DOM, so every read is faithful in jsdom.
 */
export class BreadcrumbsDriver extends PositionalListDriver<BreadcrumbItemDriver> {
  protected readonly itemSelector = 'li.astryx-breadcrumb-item';
  protected readonly itemDriverClass: ComponentDriverCtor<BreadcrumbItemDriver> = BreadcrumbItemDriver;

  protected override resolveListContainer(): Promise<PartLocator | null> {
    return Promise.resolve(locatorUtil.append(this.locator, byCssSelector('ol')));
  }

  /** The accessible name of the breadcrumb landmark (`aria-label`, default "Breadcrumb"). */
  async getLabel(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'aria-label');
  }

  /** Every crumb's visible label, in DOM order. */
  async getLabels(): Promise<readonly string[]> {
    return this.getItemLabels();
  }

  /**
   * The current crumb's label, or `undefined` when no crumb is marked current.
   * The current crumb carries `aria-current="page"` on its `<li>` or inner content.
   */
  async getCurrentLabel(): Promise<Optional<string>> {
    for (const crumb of await this.getItems()) {
      if (await crumb.isCurrent()) {
        return crumb.getLabel();
      }
    }
    return undefined;
  }

  /** Every linked crumb's `href`, in DOM order (the current crumb has no link, so it is skipped). */
  async getHrefs(): Promise<readonly string[]> {
    const hrefs: string[] = [];
    for (const crumb of await this.getItems()) {
      const href = await crumb.getHref();
      if (href != null) {
        hrefs.push(href);
      }
    }
    return hrefs;
  }

  override get driverName(): string {
    return 'AstryxBreadcrumbsDriver';
  }
}
