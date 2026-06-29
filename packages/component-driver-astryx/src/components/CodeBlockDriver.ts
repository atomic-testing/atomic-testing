import { byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

/**
 * Driver for the Astryx CodeBlock (`@astryxdesign/core/CodeBlock`).
 *
 * CodeBlock renders a `<pre data-language>` root (carrying `data-testid`) around a
 * `<code>` whose lines are `<div data-line="N">`. A header row appears when the
 * block has a language label or is collapsible; the collapsible header is a
 * `<div role="button" aria-expanded>` toggle, and a copy `<button aria-label="Copy
 * code">` flips to `"Copied"` after use. The driver reads the language off the
 * root, the source off `<code>`, and counts lines via the `data-line` markers.
 *
 * The copied state is clipboard-driven and only flips in a real browser, so it is
 * intentionally NOT exposed here (E2E/clipboard-only).
 */
export class CodeBlockDriver extends ComponentDriver<{}> {
  /** The `<code>` element holding the highlighted source. */
  private get code(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('code'));
  }

  private line(index: number): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector(`code [data-line]:nth-of-type(${index})`));
  }

  /** The collapsible header toggle (`role="button"` with `aria-expanded`), present only when collapsible. */
  private get collapseToggle(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('[role="button"][aria-expanded]'));
  }

  /** The source language from the root's `data-language` (e.g. `"javascript"`). */
  async getLanguage(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-language');
  }

  /** The full source text. */
  async getCode(): Promise<Optional<string>> {
    if (!(await this.interactor.exists(this.code))) {
      return undefined;
    }
    return (await this.interactor.getText(this.code)) ?? undefined;
  }

  /** Number of code lines (`<div data-line>` markers). */
  async getLineCount(): Promise<number> {
    let count = 0;
    for (let i = 1; await this.interactor.exists(this.line(i)); i++) {
      count++;
    }
    return count;
  }

  /**
   * Whether the block is currently collapsed — `true` only when a collapsible
   * header is present and its `aria-expanded` is `"false"`. A non-collapsible
   * block has no toggle and reports `false`.
   */
  async isCollapsed(): Promise<boolean> {
    if (!(await this.interactor.exists(this.collapseToggle))) {
      return false;
    }
    return (await this.interactor.getAttribute(this.collapseToggle, 'aria-expanded')) === 'false';
  }

  /** Toggle the collapsible header (expand/collapse). No-op when the block is not collapsible. */
  async toggleCollapse(): Promise<void> {
    if (await this.interactor.exists(this.collapseToggle)) {
      await this.interactor.click(this.collapseToggle);
    }
  }

  override get driverName(): string {
    return 'AstryxCodeBlockDriver';
  }
}
