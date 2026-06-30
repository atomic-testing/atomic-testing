import { ComponentDriverCtor, Optional, PartLocator } from '@atomic-testing/core';

import { PositionalListDriver } from '../internal/PositionalListDriver';
import { TopNavItemDriver } from './TopNavItemDriver';

/**
 * Driver for the Astryx TopNav (`@astryxdesign/core/TopNav`).
 *
 * TopNav is the application header landmark: a `<nav role="navigation">` that
 * forwards `data-testid` onto its root and carries the accessible name in
 * `aria-label`. Navigation links live in the `startContent` slot and render as
 * `<a class="astryx-top-nav-item">`; the heading link sits in a separate slot under
 * a different class.
 *
 * The items are nested inside StyleX layout `<div>`s rather than being direct
 * children of the nav, so the count/labels/lookup/select surface comes from
 * {@link PositionalListDriver} over `childListHelper`'s `:nth-child` walk: the
 * `'*'` group selector descends through those wrappers, and the
 * `a.astryx-top-nav-item` item selector keeps the heading link (a different class)
 * and any menu triggers out of the tally — neither of which a tag-based
 * `:nth-of-type` index could do reliably.
 *
 * Everything this driver reads (label, items, structure) is React-state-driven and
 * faithful in jsdom. The hover-triggered overflow menus and the mobile-bar toggle
 * are native-popover / layout behaviours exercised only by the E2E run.
 */
export class TopNavDriver extends PositionalListDriver<TopNavItemDriver> {
  protected readonly itemSelector = 'a.astryx-top-nav-item';
  protected readonly itemDriverClass: ComponentDriverCtor<TopNavItemDriver> = TopNavItemDriver;
  protected override readonly groupSelector = '*';

  protected override resolveListContainer(): Promise<PartLocator | null> {
    return Promise.resolve(this.locator);
  }

  /** The navigation landmark's accessible name (`aria-label`), or `undefined` when unset. */
  async getLabel(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'aria-label');
  }

  override get driverName(): string {
    return 'AstryxTopNavDriver';
  }
}
