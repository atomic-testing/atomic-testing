import { byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

/**
 * Driver for the Astryx Blockquote (`@astryxdesign/core/Blockquote`) — the
 * semantic `<blockquote>` with optional attribution.
 *
 * Blockquote has NO role and no `data-*` theme attributes. When a `cite` is
 * supplied it is rendered as a `<footer><cite>…</cite></footer>` descendant;
 * otherwise no `cite` exists. Inherited {@link getText} returns the WHOLE element
 * text — quote PLUS any citation concatenated — so {@link getCitation} reads the
 * `<cite>` descendant in isolation and returns `undefined` when absent. The scene
 * anchors on the forwarded `data-testid`.
 */
export class BlockquoteDriver extends ComponentDriver<{}> {
  /** The attribution `<cite>` descendant. */
  private get cite(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('cite'));
  }

  /** The attribution text (the `<cite>`), or `undefined` when the quote has no `cite`. */
  async getCitation(): Promise<Optional<string>> {
    if (!(await this.interactor.exists(this.cite))) {
      return undefined;
    }
    return (await this.interactor.getText(this.cite)) ?? undefined;
  }

  override get driverName(): string {
    return 'AstryxBlockquoteDriver';
  }
}
