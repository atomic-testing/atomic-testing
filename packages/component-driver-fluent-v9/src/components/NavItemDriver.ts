import { ComponentDriver, Optional } from '@atomic-testing/core';

/**
 * Driver for a single Fluent v9 `NavItem` / `NavSubItem` (a leaf entry of
 * `Nav`/`NavDrawer` — see {@link NavDriver}; {@link NavCategoryItemDriver}
 * extends this for the expandable-group trigger variant, `NavCategoryItem`).
 *
 * DOM audit (@fluentui/react-components@9.4.2): both render as a real
 * `<a href="...">` (when `href`/`as` is supplied) or a real `<button
 * type="button">` otherwise — so, like `BreadcrumbButtonDriver`, this driver
 * extends the common `ComponentDriver` rather than either HTML driver. The
 * component's OWN root already IS this interactive element (no wrapper `<li>`
 * to look past, unlike `BreadcrumbItemDriver`). `aria-current` is ALWAYS
 * present as a literal `"page"`/`"false"` string (never merely absent) —
 * the only stable selected-state anchor; Fluent's selected-item styling is
 * carried entirely by hashed Griffel classes with no exported un-hashed name.
 */
export class NavItemDriver extends ComponentDriver<{}> {
  /** The item's visible label, trimmed. */
  async getLabel(): Promise<Optional<string>> {
    const text = await this.interactor.getText(this.locator);
    return text?.trim();
  }

  /** Whether this item is the selected one (`aria-current="page"`). */
  async isSelected(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-current')) === 'page';
  }

  /** The item's `href`, or `undefined` when it rendered as a `<button>` (no `href` supplied). */
  async getHref(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'href');
  }

  get driverName(): string {
    return 'FluentV9NavItemDriver';
  }
}
