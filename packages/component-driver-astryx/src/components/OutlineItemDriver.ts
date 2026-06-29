import { byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

/**
 * Driver for a single Astryx Outline entry (`<li role="listitem">` wrapping an
 * `<a>`).
 *
 * Each entry renders an anchor that carries the stable `data-level` (heading
 * depth) and links to the target heading via `href="#id"`; the active entry is
 * marked `aria-current="true"` on that anchor. The driver reads these from the
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

  /** The entry's heading depth, read from the anchor's `data-level`. `undefined` when absent. */
  async getLevel(): Promise<Optional<number>> {
    const level = await this.interactor.getAttribute(this.anchor, 'data-level');
    return level == null ? undefined : Number(level);
  }

  /** Whether this is the active entry — Astryx marks it `aria-current="true"`. */
  async isActive(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.anchor, 'aria-current')) === 'true';
  }

  override get driverName(): string {
    return 'AstryxOutlineItemDriver';
  }
}
