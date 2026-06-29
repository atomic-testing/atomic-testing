import { byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

/**
 * Driver for the Astryx Item (`@astryxdesign/core/Item`).
 *
 * Item renders a tag chosen by its `as` prop (`<div>` by default, also `<li>` or
 * `<span>`), with `data-testid`, `data-density`, and `data-align` on that root.
 * The selected state is expressed as `aria-selected="true"` ONLY on an `<li>`
 * root (a `<div>` item never emits it). When the item is a link it wraps an inner
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
   * Whether the item is selected. Astryx emits `aria-selected="true"` only on an
   * `<li>` root, so a `<div>`/`<span>` item always reports `false`.
   */
  async isSelected(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-selected')) === 'true';
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
