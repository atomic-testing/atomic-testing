import { byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

/**
 * Driver for the Astryx Token (`@astryxdesign/core/Token`) — a compact chip/tag.
 *
 * Token's root tag is CONDITIONAL: a `<span>` by default, an `<a href>` when an
 * `href` is supplied; the color lives in `data-color`. Astryx forwards
 * `data-testid` onto whichever element it renders, so the scene anchors there
 * tag-agnostically. The visible label is the first inner `<span>` (for the basic
 * chip the whole text node also works); a removable token additionally renders a
 * `<button aria-label="Remove {label}">`.
 *
 * NOTE: a disabled token is styled by class only — it carries no `disabled`/
 * `aria-disabled` — so its disabled state is NOT detectable in jsdom and is
 * deliberately not exposed here (it would only be observable via a browser).
 */
export class TokenDriver extends ComponentDriver<{}> {
  /** The remove control, present only on a removable token. */
  private get removeButton(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('button[aria-label^="Remove"]'));
  }

  /**
   * The token's visible label — the direct-child `<span>`'s text when present
   * (Token nests the label as an immediate child), falling back to the root's text
   * otherwise. The child combinator (`> span`) matters: a removable token also has
   * an icon `<span>` nested inside its remove `<button>`, so a descendant `span`
   * would match two elements.
   */
  async getLabel(): Promise<Optional<string>> {
    const labelSpan = locatorUtil.append(this.locator, byCssSelector('> span'));
    if (await this.interactor.exists(labelSpan)) {
      return (await this.interactor.getText(labelSpan))?.trim();
    }
    return (await this.getText())?.trim();
  }

  /** The color variant (`data-color`). */
  async getVariant(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-color');
  }

  /** The link target — the `href`, or `undefined` for the default (non-link) `<span>` token. */
  async getHref(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'href');
  }

  /** Whether the token can be removed — it renders a `Remove {label}` button. */
  async isRemovable(): Promise<boolean> {
    return this.interactor.exists(this.removeButton);
  }

  /**
   * Remove the token by clicking its remove button.
   * @returns `false` when the token is not removable.
   */
  async remove(): Promise<boolean> {
    if (!(await this.interactor.exists(this.removeButton))) {
      return false;
    }
    await this.interactor.click(this.removeButton);
    return true;
  }

  get driverName(): string {
    return 'AstryxTokenDriver';
  }
}
