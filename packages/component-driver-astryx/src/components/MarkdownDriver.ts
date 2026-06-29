import { childListHelper, ComponentDriver, Optional } from '@atomic-testing/core';

/**
 * Driver for the Astryx Markdown (`@astryxdesign/core/Markdown`).
 *
 * Markdown renders its source into native HTML under a root whose shape depends
 * on `display`: a block `<div role="document">` or an inline `<span>` (no role).
 * `data-testid` and `data-density` sit on that root. The driver detects inline
 * mode by the ABSENCE of `role="document"`, and counts the rendered headings
 * (`h1`–`h6`) and links (`a[href]`).
 *
 * A link or heading is **not** a direct child of the root — Markdown nests them in
 * block wrappers (`<p>`/`<li>`/`<blockquote>`), each typically the sole element of
 * its tag in that block, so a tag-based `:nth-of-type` walk undercounts a document
 * whose links/headings span separate blocks. The counts therefore use
 * `childListHelper`'s portable `:nth-child` walk with a `'*'` group selector, which
 * descends through any layout wrapper and tallies matches across the whole subtree.
 * The copy-code affordance on fenced blocks is clipboard-driven and not exercised
 * here (E2E-only).
 */
export class MarkdownDriver extends ComponentDriver<{}> {
  /**
   * Whether the markdown was rendered inline. Block markdown carries
   * `role="document"` on its root; the inline `<span>` does not.
   */
  async isInline(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'role')) !== 'document';
  }

  /** The density token from `data-density`. */
  async getDensity(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-density');
  }

  /** Number of rendered headings (`<h1>`–`<h6>`), summed across levels. */
  async getHeadingCount(): Promise<number> {
    let count = 0;
    for (let level = 1; level <= 6; level++) {
      count += await childListHelper.countMatchingChildren(this.interactor, this.locator, `h${level}`, '*');
    }
    return count;
  }

  /** Number of rendered links (`<a href>`). */
  async getLinkCount(): Promise<number> {
    return childListHelper.countMatchingChildren(this.interactor, this.locator, 'a[href]', '*');
  }

  override get driverName(): string {
    return 'AstryxMarkdownDriver';
  }
}
