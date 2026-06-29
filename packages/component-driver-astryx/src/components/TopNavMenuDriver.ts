import { byCssSelector, ComponentDriver, Optional, PartLocator } from '@atomic-testing/core';

/**
 * Driver for the Astryx TopNavMenu (`@astryxdesign/core/TopNav`, `TopNavMenu`).
 *
 * TopNavMenu renders a trigger `<button class="astryx-top-nav-menu"
 * aria-haspopup="dialog" aria-expanded aria-controls>` and a **sibling** panel
 * (`<div popover="auto"><div role="dialog"><div role="menu">…</div></div></div>`)
 * whose items are `role="menuitem"` anchors. The trigger does **not** forward
 * `data-testid`, so the scene anchors on `button.astryx-top-nav-menu` (the semantic
 * class is the only stable handle). The panel is **not** a descendant of the
 * trigger, so {@link getItemTitles} re-roots to it through the trigger's
 * `aria-controls` → panel `id` link (`'Root'`), mirroring {@link PopoverDriver}.
 *
 * The panel markup is always mounted, so item reads are faithful in jsdom. The OPEN
 * transition is native-popover-driven (`showPopover()`), a **no-op in jsdom**, so
 * {@link isOpen} only ever reports `true` under the E2E (browser) run — never assert
 * the open state in the shared suite; assert the closed-state (`aria-expanded="false"`)
 * and the item titles instead.
 */
export class TopNavMenuDriver extends ComponentDriver<{}> {
  /** The panel id from the trigger's `aria-controls`, or `null` when unlinked. */
  private async panelId(): Promise<string | null> {
    const id = await this.interactor.getAttribute(this.locator, 'aria-controls');
    return id || null;
  }

  private menuItem(panelId: string, index: number): PartLocator {
    return byCssSelector(`[id="${panelId}"] [role="menuitem"]:nth-of-type(${index})`, 'Root');
  }

  /** The trigger's visible label. */
  async getLabel(): Promise<Optional<string>> {
    return (await this.getText()) ?? undefined;
  }

  /**
   * Whether the menu is open — read from the trigger's `aria-expanded`.
   *
   * E2E-only for `true`: opening calls `showPopover()`, which is a no-op in jsdom,
   * so this stays `false` there regardless of interaction.
   */
  async isOpen(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-expanded')) === 'true';
  }

  /** Every menu item's title text, in DOM order (readable while the panel is closed). */
  async getItemTitles(): Promise<readonly string[]> {
    const panelId = await this.panelId();
    if (panelId == null) {
      return [];
    }
    const titles: string[] = [];
    for (let i = 1; await this.interactor.exists(this.menuItem(panelId, i)); i++) {
      const title = (await this.interactor.getText(this.menuItem(panelId, i)))?.trim();
      if (title) {
        titles.push(title);
      }
    }
    return titles;
  }

  get driverName(): string {
    return 'AstryxTopNavMenuDriver';
  }
}
