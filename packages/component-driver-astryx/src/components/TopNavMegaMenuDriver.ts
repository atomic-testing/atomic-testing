import { byCssSelector, ComponentDriver, Optional, PartLocator } from '@atomic-testing/core';

/**
 * Driver for the Astryx TopNavMegaMenu (`@astryxdesign/core/TopNav`,
 * `TopNavMegaMenu`).
 *
 * TopNavMegaMenu renders a trigger `<button class="astryx-top-nav-mega-menu"
 * aria-haspopup="true" aria-expanded>` and a full-width inline panel whose entries
 * are `<a class="astryx-top-nav-mega-menu-item">` laid out in a grid. Like
 * {@link TopNavMenuDriver} the trigger does **not** forward `data-testid`, so the
 * scene anchors on `button.astryx-top-nav-mega-menu`. (Note `aria-haspopup="true"`,
 * not `"dialog"` — the mega panel is not a dialog landmark.)
 *
 * Entry markup is always mounted, so {@link getItemTitles} and structural reads are
 * faithful in jsdom. The OPEN transition uses the native Popover API
 * (`showPopover()`), a **no-op in jsdom**, so {@link isExpanded} reports `true`
 * only under the E2E (browser) run — never assert the expanded state in the shared
 * suite; assert the closed-state (`aria-expanded="false"`) and item titles instead.
 */
export class TopNavMegaMenuDriver extends ComponentDriver<{}> {
  /**
   * A mega-menu entry by position. The panel is a **sibling** of the trigger and
   * carries no `aria-controls` link, so entries are re-rooted at the document
   * (`'Root'`) by their stable `astryx-top-nav-mega-menu-item` class. Best-effort
   * for a single mega menu per scene (documented v1 limit).
   */
  private item(index: number): PartLocator {
    return byCssSelector(`a.astryx-top-nav-mega-menu-item:nth-of-type(${index})`, 'Root');
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
    const titles: string[] = [];
    for (let i = 1; await this.interactor.exists(this.item(i)); i++) {
      const title = (await this.interactor.getText(this.item(i)))?.trim();
      if (title) {
        titles.push(title);
      }
    }
    return titles;
  }

  get driverName(): string {
    return 'AstryxTopNavMegaMenuDriver';
  }
}
