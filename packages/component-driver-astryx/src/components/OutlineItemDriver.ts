import { byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

/**
 * Driver for a single Astryx Outline entry (`<li role="listitem">` wrapping an
 * `<a>`).
 *
 * Each entry renders an anchor that carries the stable `data-level` (heading
 * depth) and links to the target heading via `href="#id"`; the active entry is
 * marked `aria-current="location"` on that anchor. The driver reads these from the
 * `<a>`, never from StyleX-hashed classes.
 */
export class OutlineItemDriver extends ComponentDriver {
  private get anchor(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('a'));
  }

  /** The entry's visible label (anchor text), trimmed. */
  async getLabel(): Promise<Optional<string>> {
    return (await this.getText())?.trim() || undefined;
  }

  /** The entry's link target (`href`), e.g. `#features`. */
  async getHref(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.anchor, 'href');
  }

  /** The entry's heading depth, read from the anchor's `data-level`. `undefined` when absent or non-numeric. */
  async getLevel(): Promise<Optional<number>> {
    const level = await this.interactor.getAttribute(this.anchor, 'data-level');
    if (level == null) {
      return undefined;
    }
    const parsed = Number.parseFloat(level);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  /**
   * Whether this is the active entry.
   *
   * Astryx 0.2.0 corrected the marker from the generic `aria-current="true"` to
   * `aria-current="location"` — the token WAI-ARIA defines for "the current item
   * within a set of related pages", which a table-of-contents entry is.
   */
  async isActive(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.anchor, 'aria-current')) === 'location';
  }

  override get driverName(): string {
    return 'AstryxOutlineItemDriver';
  }
}
