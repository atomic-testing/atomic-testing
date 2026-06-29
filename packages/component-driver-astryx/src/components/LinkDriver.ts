import { HTMLAnchorDriver } from '@atomic-testing/component-driver-html';
import { Optional } from '@atomic-testing/core';

/**
 * Driver for the Astryx Link (`@astryxdesign/core/Link`).
 *
 * Link renders an `<a>` when `href` is set and a `<button>` (link-styled) when it
 * is not — Astryx forwards unknown props (`data-testid`) onto whichever element
 * it renders, so the scene anchors there directly. Extends {@link HTMLAnchorDriver}
 * for `click`/`hover`/`getHref`/`getTarget`; the button-fallback case is detected
 * by the absence of `href` rather than by sniffing the tag name.
 */
export class LinkDriver extends HTMLAnchorDriver {
  /** The link's `rel` attribute (Astryx sets `noopener noreferrer` for external links). */
  async getRel(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'rel');
  }

  /**
   * The link's accessible name — the verbatim `aria-label` (set for icon-only
   * links) when present, otherwise the visible text.
   */
  async getLabel(): Promise<Optional<string>> {
    const ariaLabel = await this.interactor.getAttribute(this.locator, 'aria-label');
    return ariaLabel || (await this.getText());
  }

  /**
   * Whether the link renders as its `<button>` fallback — Astryx does this when
   * no `href` is supplied (a link with nowhere to go is a button, semantically).
   */
  async isButtonFallback(): Promise<boolean> {
    return (await this.getHref()) == null;
  }

  /**
   * Whether the link is disabled. Astryx marks disabled links with
   * `aria-disabled` (and the button fallback with the native `disabled`).
   */
  async isDisabled(): Promise<boolean> {
    if ((await this.interactor.getAttribute(this.locator, 'aria-disabled')) === 'true') {
      return true;
    }
    return this.interactor.isDisabled(this.locator);
  }

  override get driverName(): string {
    return 'AstryxLinkDriver';
  }
}
