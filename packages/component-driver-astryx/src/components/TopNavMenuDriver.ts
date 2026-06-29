import { byAttribute, byCssSelector, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

import { AstryxMenuDriver } from './AstryxMenuDriver';

/**
 * Driver for the Astryx TopNavMenu (`@astryxdesign/core/TopNav`, `TopNavMenu`).
 *
 * TopNavMenu renders a trigger `<button class="astryx-top-nav-menu"
 * aria-haspopup="dialog" aria-expanded aria-controls>` and a **sibling** panel
 * (`<div popover="auto"><div role="dialog" id={panelId}><div role="menu">…</div></div></div>`)
 * whose items are `role="menuitem"` entries — an `<a>` when the item has an `href`,
 * a `<div>` otherwise, so a menu mixing link and action items has heterogeneous
 * same-role siblings. The trigger does **not** forward `data-testid`, so the scene
 * anchors on `button.astryx-top-nav-menu` (the semantic class is the only stable
 * handle).
 *
 * The panel is **not** a descendant of the trigger, so {@link resolveMenuLocator}
 * re-roots to its `role="menu"` through the trigger's `aria-controls` → dialog `id`
 * link (`'Root'`), mirroring {@link DropdownMenuDriver}; the item count/labels come
 * from {@link AstryxMenuDriver}'s `childListHelper` `:nth-child` walk, which is
 * tag-agnostic (so the `<a>`/`<div>` item mix enumerates faithfully).
 *
 * The panel markup is always mounted, so item reads are faithful in jsdom. The OPEN
 * transition is native-popover-driven (`showPopover()`), a **no-op in jsdom**, so
 * {@link isOpen} only ever reports `true` under the E2E (browser) run — never assert
 * the open state in the shared suite; assert the closed-state (`aria-expanded="false"`)
 * and the item titles instead.
 */
export class TopNavMenuDriver extends AstryxMenuDriver {
  /**
   * The `role="menu"` inside the popover panel linked by the trigger's
   * `aria-controls` → dialog `id`, or `null` when unlinked. The id is matched
   * through the escaping `byAttribute` builder, then drilled to the menu the
   * dialog wraps.
   */
  protected override async resolveMenuLocator(): Promise<PartLocator | null> {
    const panelId = await this.interactor.getAttribute(this.locator, 'aria-controls');
    if (!panelId) {
      return null;
    }
    return locatorUtil.append(byAttribute('id', panelId, 'Root'), byCssSelector('[role="menu"]'));
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
    return this.getItemLabels();
  }

  override get driverName(): string {
    return 'AstryxTopNavMenuDriver';
  }
}
