import { byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

/**
 * Driver for the Astryx Item (`@astryxdesign/core/Item`).
 *
 * Item renders a tag chosen by its `as` prop (`<div>` by default, also `<li>` or
 * `<span>`), with `data-testid`, `data-density`, and `data-align` on that root.
 * The selected state is `aria-selected="true"` when an explicit `role` permits it
 * (`option`/`tab`/`row`/`gridcell`/`columnheader`/`rowheader`/`treeitem`), or —
 * since Astryx 0.1.9 — `aria-current="true"` on any other root (no `role`, or one
 * that doesn't permit `aria-selected`, e.g. the default `<div>`/`<li>`), never
 * both at once. See {@link isSelected}. When the item is a link it wraps an inner
 * `<a href>`; when it has an `onClick` it wraps an inner `<button>`. The driver
 * anchors on the root and reads the label as its text content.
 */
export class ItemDriver extends ComponentDriver<{}> {
  /** The inner `<a>`, present only when the item is rendered as a link. */
  private get anchor(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('a'));
  }

  /** The item's visible label (its full text content). */
  async getLabel(): Promise<Optional<string>> {
    return (await this.getText()) ?? undefined;
  }

  /** The density token from `data-density`. */
  async getDensity(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-density');
  }

  /** The alignment token from `data-align`. */
  async getAlign(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-align');
  }

  /**
   * Whether the item is selected. Since Astryx 0.1.9, `aria-selected` is only
   * emitted when an explicit `role` permits it (`option`/`tab`/`row`/`gridcell`/
   * `columnheader`/`rowheader`/`treeitem`) — invalid ARIA otherwise (axe:
   * aria-allowed-attr). A `<div>`/plain `<li>` root (no permitted role) instead
   * falls back to `aria-current="true"`, so this checks both; they are mutually
   * exclusive by construction (never both `"true"` at once).
   */
  async isSelected(): Promise<boolean> {
    const [ariaSelected, ariaCurrent] = await Promise.all([
      this.interactor.getAttribute(this.locator, 'aria-selected'),
      this.interactor.getAttribute(this.locator, 'aria-current'),
    ]);
    return ariaSelected === 'true' || ariaCurrent === 'true';
  }

  /** The link target (`href` of the inner `<a>`), or `undefined` when the item is not a link. */
  async getHref(): Promise<Optional<string>> {
    if (!(await this.interactor.exists(this.anchor))) {
      return undefined;
    }
    return this.interactor.getAttribute(this.anchor, 'href');
  }

  override get driverName(): string {
    return 'AstryxItemDriver';
  }
}
