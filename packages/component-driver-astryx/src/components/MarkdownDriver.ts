import { byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

/**
 * Driver for the Astryx Markdown (`@astryxdesign/core/Markdown`).
 *
 * Markdown renders its source into native HTML under a root whose shape depends
 * on `display`: a block `<div role="document">` or an inline `<span>` (no role).
 * `data-testid` and `data-density` sit on that root. The driver detects inline
 * mode by the ABSENCE of `role="document"`, and counts the rendered headings
 * (`h1`–`h6`) and links (`a[href]`) by enumerating descendants — there is no
 * per-element testid, so the counts mirror MetadataList's iterate-with-`exists`
 * style. The copy-code affordance on fenced blocks is clipboard-driven and is not
 * exercised here (E2E-only).
 */
export class MarkdownDriver extends ComponentDriver<{}> {
  private heading(level: number, index: number): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector(`h${level}:nth-of-type(${index})`));
  }

  private link(index: number): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector(`a[href]:nth-of-type(${index})`));
  }

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
      for (let i = 1; await this.interactor.exists(this.heading(level, i)); i++) {
        count++;
      }
    }
    return count;
  }

  /** Number of rendered links (`<a href>`). */
  async getLinkCount(): Promise<number> {
    let count = 0;
    for (let i = 1; await this.interactor.exists(this.link(i)); i++) {
      count++;
    }
    return count;
  }

  override get driverName(): string {
    return 'AstryxMarkdownDriver';
  }
}
