import { ComponentDriver, Optional } from '@atomic-testing/core';

/**
 * Driver for the Astryx Citation (`@astryxdesign/core/Citation`) — an inline
 * reference marker.
 *
 * Citation's root tag is CONDITIONAL: an `<a>` when its source has a `url`,
 * otherwise a `<span>`; both always carry `role="doc-noteref"`, an
 * `aria-label="Citation {number}: {title}"`, a `title` (the source title), and a
 * `data-variant` (`'label'` | `'number'`). Astryx forwards `data-testid` onto
 * whichever element it renders, so the scene anchors there tag-agnostically and
 * detects the link case by the presence of `href` rather than by sniffing the tag.
 */
export class CitationDriver extends ComponentDriver<{}> {
  /** The source title — the `title` attribute (also the visible text in the `label` variant). */
  async getTitle(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'title');
  }

  /**
   * The citation number, parsed from the `aria-label` (`"Citation {n}: {title}"`)
   * so it is read identically for both the `label` and `number` variants.
   * `undefined` when the label does not carry a number.
   */
  async getNumber(): Promise<Optional<number>> {
    const ariaLabel = await this.interactor.getAttribute(this.locator, 'aria-label');
    const match = ariaLabel?.match(/Citation\s+(\d+)/);
    return match ? Number(match[1]) : undefined;
  }

  /** The link target — the `href`, or `undefined` when the citation has no `url` (renders a `<span>`). */
  async getHref(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'href');
  }

  /** Whether the citation is a link — Astryx renders an `<a href>` only when its source has a `url`. */
  async isLink(): Promise<boolean> {
    return (await this.getHref()) != null;
  }

  /** The variant (`data-variant`): `'label'` or `'number'`. */
  async getVariant(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-variant');
  }

  get driverName(): string {
    return 'AstryxCitationDriver';
  }
}
