import { byCssSelector, Optional, PartLocator } from '@atomic-testing/core';

import { AstryxMenuDriver } from './AstryxMenuDriver';

/**
 * Driver for the Astryx DropdownMenu (`@astryxdesign/core/DropdownMenu`).
 *
 * The scene anchors this driver on the **trigger** `<button>` (which forwards
 * `data-testid` and carries `aria-haspopup="menu"`, `aria-expanded`, and
 * `aria-controls`). The menu panel is rendered as a *sibling* of the trigger (no
 * portal) and linked by `aria-controls` → the `role="menu"` element's `id`, so
 * {@link resolveMenuLocator} reads that link at runtime and re-roots from the
 * document — instance-safe even with several dropdowns on the page, and never
 * coupled to a StyleX-hashed class. Item operations come from
 * {@link AstryxMenuDriver}.
 *
 * Open state is read from the trigger's `aria-expanded` (React-state-driven, so
 * faithful in jsdom). The panel's true visibility is a native-popover behaviour
 * that only the E2E run exercises; the items are always mounted, so labels/count
 * read in both states, but selecting an item must `open()` first because a closed
 * popover is not interactable in a real browser.
 */
export class DropdownMenuDriver extends AstryxMenuDriver {
  protected override async resolveMenuLocator(): Promise<PartLocator | null> {
    const menuId = await this.interactor.getAttribute(this.locator, 'aria-controls');
    if (!menuId) {
      return null;
    }
    return byCssSelector(`[id="${menuId}"]`, 'Root');
  }

  /** Whether the menu is open — read from the trigger's `aria-expanded`. */
  async isOpen(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-expanded')) === 'true';
  }

  /** Open the menu by clicking the trigger, if it is not already open. */
  async open(): Promise<void> {
    if (!(await this.isOpen())) {
      await this.click();
    }
  }

  /** Close the menu by clicking the trigger, if it is open. */
  async close(): Promise<void> {
    if (await this.isOpen()) {
      await this.click();
    }
  }

  /** The trigger's accessible label — its visible text for a labelled dropdown. */
  async getTriggerLabel(): Promise<Optional<string>> {
    return (await this.getText()) ?? undefined;
  }

  override get driverName(): string {
    return 'AstryxDropdownMenuDriver';
  }
}

/**
 * Driver for the Astryx MoreMenu (`@astryxdesign/core/MoreMenu`) — an icon-only
 * "⋯" overflow menu that is a thin wrapper over DropdownMenu. The DOM contract is
 * identical (trigger `<button>` + `aria-controls`-linked `role="menu"` panel), so
 * the driver only differs in how the trigger names itself: there is no visible
 * text, so the accessible name comes from `aria-label`.
 */
export class MoreMenuDriver extends DropdownMenuDriver {
  /** The trigger's accessible label — its `aria-label` (the icon-only button has no text). */
  override async getTriggerLabel(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'aria-label');
  }

  override get driverName(): string {
    return 'AstryxMoreMenuDriver';
  }
}
