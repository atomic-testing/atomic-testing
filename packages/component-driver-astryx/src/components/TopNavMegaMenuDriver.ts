import { byCssSelector, ComponentDriverCtor, Optional, PartLocator } from '@atomic-testing/core';

import { PositionalListDriver } from '../internal/PositionalListDriver';
import { MenuItemDriver } from './MenuItemDriver';

/**
 * Driver for the Astryx TopNavMegaMenu (`@astryxdesign/core/TopNav`,
 * `TopNavMegaMenu`).
 *
 * TopNavMegaMenu renders a trigger `<button class="astryx-top-nav-mega-menu"
 * aria-haspopup="true" aria-expanded>` and a full-width `role="menu"` panel whose
 * entries are `astryx-top-nav-mega-menu-item` elements — an `<a>` when the entry has
 * an `href`, a `<div>` otherwise — laid out in a grid. The trigger does **not**
 * forward `data-testid`, so the scene anchors on `button.astryx-top-nav-mega-menu`.
 * (Note `aria-haspopup="true"`, not `"dialog"`.)
 *
 * The panel is a sibling of the trigger with **no `aria-controls` id link** back to
 * it, so {@link resolveListContainer} re-roots to the panel's `role="menu"` at the
 * document (`'Root'`) — best-effort for a single mega menu per scene (documented v1
 * limit). The count/labels come from {@link PositionalListDriver} over
 * `childListHelper`'s `:nth-child` walk (with a `'*'` group selector to descend
 * through the grid's column wrappers), which is tag-agnostic — so the `<a>`/`<div>`
 * entry mix and any per-column wrapping enumerate faithfully, unlike the prior
 * `:nth-of-type` index.
 *
 * Entry markup is always mounted, so {@link getItemTitles} and structural reads are
 * faithful in jsdom. The OPEN transition uses the native Popover API
 * (`showPopover()`), a **no-op in jsdom**, so {@link isExpanded} reports `true`
 * only under the E2E (browser) run — never assert the expanded state in the shared
 * suite; assert the closed-state (`aria-expanded="false"`) and item titles instead.
 */
export class TopNavMegaMenuDriver extends PositionalListDriver<MenuItemDriver> {
  protected readonly itemSelector = '.astryx-top-nav-mega-menu-item';
  protected readonly itemDriverClass: ComponentDriverCtor<MenuItemDriver> = MenuItemDriver;
  protected override readonly groupSelector = '*';

  /** The mega-menu panel's `role="menu"`, re-rooted at the document (best-effort single instance). */
  protected override resolveListContainer(): Promise<PartLocator | null> {
    return Promise.resolve(byCssSelector('[role="menu"]', 'Root'));
  }

  /** The trigger's visible label. */
  async getLabel(): Promise<Optional<string>> {
    return (await this.getText()) ?? undefined;
  }

  /**
   * Whether the mega menu is expanded — read from the trigger's `aria-expanded`.
   *
   * E2E-only for `true`: expansion calls `showPopover()`, a no-op in jsdom, so this
   * stays `false` there regardless of interaction.
   */
  async isExpanded(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-expanded')) === 'true';
  }

  /** Every mega-menu entry's title text, in DOM order (readable while the panel is closed). */
  async getItemTitles(): Promise<readonly string[]> {
    return this.getItemLabels();
  }

  override get driverName(): string {
    return 'AstryxTopNavMegaMenuDriver';
  }
}
