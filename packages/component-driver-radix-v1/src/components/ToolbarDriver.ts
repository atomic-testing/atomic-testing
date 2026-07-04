import { childListHelper, ComponentDriver, Optional } from '@atomic-testing/core';

/**
 * CSS for a toolbar item. Radix registers every focusable toolbar item —
 * `Toolbar.Button`, `Toolbar.Link`, and each `Toolbar.ToggleItem` — in its
 * roving-focus collection via `data-radix-collection-item` (a Radix structural
 * attribute, anchor tier 3), regardless of tag (`<button>`/`<a>`). Separators
 * and the `Toolbar.ToggleGroup` wrapper are not collection items, so they are
 * skipped/recursed naturally.
 */
const toolbarItemSelector = '[data-radix-collection-item]';

/**
 * Driver for a Radix `Toolbar` (`Toolbar.Root` from `radix-ui`) — an ordinary
 * IN-TREE `role="toolbar"` element, no portal involved.
 *
 * Rendered-DOM quirk worth knowing (verified against `radix-ui@1.6.1`):
 * `Toolbar.ToggleGroup` ALSO renders `role="toolbar"` (not `role="group"`) —
 * so anchor scenes on a forwarded `data-testid` or an `aria-label`-qualified
 * role, never a bare `[role="toolbar"]`, when a toggle group is present.
 *
 * Individual items are consumer-shaped (buttons, links, toggle items with
 * their own `data-testid`s); declare the ones a test interacts with as plain
 * scene parts (`HTMLButtonDriver`, `ToggleDriver`, `ToggleGroupDriver`, …).
 * This driver covers the bar-level reads. Roving Arrow/Home/End focus movement
 * is focus management jsdom cannot model faithfully — assert it E2E if a
 * consumer needs it, as Astryx's `ToolbarDriver` also documents.
 */
export class ToolbarDriver extends ComponentDriver<{}> {
  /** The toolbar's accessible name (`aria-label`). */
  async getLabel(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'aria-label');
  }

  /** The toolbar's orientation (`data-orientation`), `horizontal` by default. */
  async getOrientation(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-orientation');
  }

  /**
   * The number of focusable items in the toolbar (see
   * {@link toolbarItemSelector}). The `'*'` group recursion descends through
   * non-item wrappers such as `Toolbar.ToggleGroup`, so nested toggle items
   * are counted; the walk is `childListHelper`'s portable `:nth-child` one
   * (a `getAttribute(..., true).length` read is not interactor-portable).
   */
  async getItemCount(): Promise<number> {
    return childListHelper.countMatchingChildren(this.interactor, this.locator, toolbarItemSelector, '*');
  }

  get driverName(): string {
    return 'RadixV1ToolbarDriver';
  }
}
