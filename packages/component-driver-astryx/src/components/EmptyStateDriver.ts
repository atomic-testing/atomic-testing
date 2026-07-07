import { byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

/**
 * Driver for the Astryx EmptyState (`@astryxdesign/core/EmptyState`).
 *
 * EmptyState renders a `<div role="status">` (the live-region root, where
 * `data-testid` is forwarded) wrapping a heading (`<h1>`–`<h6>`, defaulting to
 * `<h3>`), a description, and — when `actions` are supplied — a trailing
 * actions `<div>` holding the action `<button>`s. The scene anchors on the root
 * and reaches the heading/description/action by their native tags rather than by
 * StyleX-hashed classes. The heading level is read off whichever `h*` tag exists,
 * since the rendered level varies with the `headingLevel` prop. The description is
 * an untagged `<div>` (Astryx 0.1.2+ renders it as `<div>` rather than `<p>` so it
 * can hold arbitrary ReactNode content), reached as the heading's immediate next
 * sibling rather than by tag name.
 */
export class EmptyStateDriver extends ComponentDriver<{}> {
  /**
   * The heading at a specific level. Probed one level at a time (a single `h${n}`
   * tag) rather than via an `h1,…,h6` selector list — a comma list would leave the
   * later alternatives unscoped, matching another EmptyState's heading on the page.
   */
  private headingAt(level: number): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector(`h${level}`));
  }

  /**
   * The description, the heading's immediate next sibling `<div>`. Probed one
   * level at a time (like {@link headingAt}) rather than via an `h1 + div, …`
   * selector list — a comma list would leave the later alternatives unscoped,
   * matching another EmptyState's description on the page.
   */
  private descriptionAfter(level: number): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector(`h${level} + div`));
  }

  private get action(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('button'));
  }

  /** The heading text, read from whichever `h1`–`h6` level is rendered. */
  async getTitle(): Promise<Optional<string>> {
    for (let level = 1; level <= 6; level++) {
      const heading = this.headingAt(level);
      if (await this.interactor.exists(heading)) {
        return (await this.interactor.getText(heading)) ?? undefined;
      }
    }
    return undefined;
  }

  /** The description paragraph text, or `undefined` when no description is rendered. */
  async getDescription(): Promise<Optional<string>> {
    for (let level = 1; level <= 6; level++) {
      const description = this.descriptionAfter(level);
      if (await this.interactor.exists(description)) {
        return (await this.interactor.getText(description)) ?? undefined;
      }
    }
    return undefined;
  }

  /**
   * The heading level (1–6) derived from the rendered tag name. Astryx renders the
   * heading at `headingLevel` (default 3), so the level is discovered by probing
   * `h1`…`h6` rather than read from an attribute.
   */
  async getHeadingLevel(): Promise<Optional<number>> {
    for (let level = 1; level <= 6; level++) {
      if (await this.interactor.exists(this.headingAt(level))) {
        return level;
      }
    }
    return undefined;
  }

  /** Whether the empty state is present in the DOM. */
  async isPresent(): Promise<boolean> {
    return this.exists();
  }

  /** Whether an action button is rendered (the `actions` prop was supplied). */
  async hasAction(): Promise<boolean> {
    return this.interactor.exists(this.action);
  }

  override get driverName(): string {
    return 'AstryxEmptyStateDriver';
  }
}
